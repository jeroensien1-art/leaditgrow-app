/**
 * Gmail REST API helper — reads replies to our emails, marks with label after processing.
 * No extra npm package: uses plain fetch + existing OAuth2 refresh token.
 */

const PROCESSED_LABEL = 'lg-replied'
let cachedLabelId: string | null = null

export interface GmailReply {
  id: string
  threadId: string
  fromEmail: string
  subject: string
  text: string
  originalSubject: string
  originalMessageId: string  // value of In-Reply-To header (our sent message-id)
}

async function getAccessToken(): Promise<string> {
  const tokenJson = process.env.GMAIL_TOKEN_JSON
  if (!tokenJson) throw new Error('GMAIL_TOKEN_JSON not set')
  const creds = JSON.parse(tokenJson) as {
    client_id: string; client_secret: string; refresh_token: string; token_uri: string
  }
  const res = await fetch(creds.token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     creds.client_id,
      client_secret: creds.client_secret,
      refresh_token: creds.refresh_token,
      grant_type:    'refresh_token',
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(`Gmail token error: ${JSON.stringify(data)}`)
  return data.access_token
}

function decodeBase64Url(encoded: string): string {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(base64, 'base64').toString('utf-8')
}

function header(headers: Array<{ name: string; value: string }>, name: string): string {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? ''
}

function extractPlainText(payload: Record<string, unknown>): string {
  const body = payload.body as { data?: string } | undefined
  if (body?.data) return decodeBase64Url(body.data)

  const parts = payload.parts as Array<Record<string, unknown>> | undefined
  if (parts) {
    for (const part of parts) {
      if (part.mimeType === 'text/plain') {
        const partBody = part.body as { data?: string } | undefined
        if (partBody?.data) return decodeBase64Url(partBody.data)
      }
    }
    for (const part of parts) {
      const text = extractPlainText(part)
      if (text) return text
    }
  }
  return ''
}

function stripQuotedText(text: string): string {
  // Remove lines that start with > (quoted reply) and "On ... wrote:" patterns
  const lines = text.split('\n')
  const cleaned: string[] = []
  for (const line of lines) {
    if (line.startsWith('>')) continue
    if (/^On .+wrote:$/i.test(line.trim())) break  // stop at quote header
    cleaned.push(line)
  }
  return cleaned.join('\n').trim()
}

async function getOrCreateLabelId(token: string): Promise<string> {
  if (cachedLabelId) return cachedLabelId
  const auth = { Authorization: `Bearer ${token}` }

  const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', { headers: auth })
  const listData = await listRes.json() as { labels: Array<{ id: string; name: string }> }
  const existing = listData.labels?.find(l => l.name === PROCESSED_LABEL)
  if (existing) { cachedLabelId = existing.id; return existing.id }

  const createRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: PROCESSED_LABEL, labelListVisibility: 'labelHide', messageListVisibility: 'hide' }),
  })
  const label = await createRes.json() as { id: string }
  cachedLabelId = label.id
  return label.id
}

export async function markProcessed(messageId: string): Promise<void> {
  const token = await getAccessToken()
  const labelId = await getOrCreateLabelId(token)
  await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ addLabelIds: [labelId] }),
  })
}

export async function getUnreadReplies(): Promise<GmailReply[]> {
  const token = await getAccessToken()
  const auth = { Authorization: `Bearer ${token}` }

  // Get label ID so we can exclude already-processed messages
  const labelId = await getOrCreateLabelId(token)
  const excludeLabel = encodeURIComponent(`-label:${PROCESSED_LABEL}`)

  // Inbox messages from last 7 days, NOT sent by us, NOT already processed
  const listRes = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages' +
    `?q=in:inbox+-from:jeroen%40leaditgrow.be+newer_than:7d+${excludeLabel}&maxResults=20`,
    { headers: auth }
  )
  const listData = await listRes.json() as { messages?: Array<{ id: string; threadId: string }> }
  const messages = listData.messages ?? []

  const replies: GmailReply[] = []

  for (const msg of messages) {
    // Full message
    const msgRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
      { headers: auth }
    )
    const msgData = await msgRes.json() as {
      payload: { headers: Array<{ name: string; value: string }>; [k: string]: unknown }
      threadId: string
    }
    const hdrs = msgData.payload?.headers ?? []

    const inReplyTo = header(hdrs, 'In-Reply-To')
    const messageId = header(hdrs, 'Message-ID')
    const from = header(hdrs, 'From')
    const emailMatch = from.match(/<(.+?)>/)
    const fromEmail = emailMatch ? emailMatch[1] : from.trim()
    const subject = header(hdrs, 'Subject')
    const rawText = extractPlainText(msgData.payload)
    const text = stripQuotedText(rawText)

    if (inReplyTo) {
      // Reply in a thread — only handle if the thread has a message from us
      const threadRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/threads/${msg.threadId}` +
        '?format=metadata&metadataHeaders=From&metadataHeaders=Subject',
        { headers: auth }
      )
      const threadData = await threadRes.json() as {
        messages: Array<{ payload: { headers: Array<{ name: string; value: string }> } }>
      }
      const threadMsgs = threadData.messages ?? []

      const sentByUs = threadMsgs.some(m =>
        header(m.payload?.headers ?? [], 'From').includes('jeroen@leaditgrow.be')
      )
      if (!sentByUs) continue

      // Skip if we already replied: last message in thread is from us
      const lastMsg = threadMsgs[threadMsgs.length - 1]
      const lastFrom = header(lastMsg?.payload?.headers ?? [], 'From')
      if (lastFrom.includes('jeroen@leaditgrow.be')) continue

      const firstMsg = threadMsgs[0]
      const originalSubject = header(firstMsg?.payload?.headers ?? [], 'Subject') || subject

      replies.push({
        id: msg.id,
        threadId: msg.threadId,
        fromEmail,
        subject,
        text,
        originalSubject,
        originalMessageId: inReplyTo,
      })
    } else {
      // Standalone email — treat as new inbound lead
      if (!text.trim()) continue  // skip empty/automated messages with no body

      replies.push({
        id: msg.id,
        threadId: msg.threadId,
        fromEmail,
        subject,
        text,
        originalSubject: subject,
        originalMessageId: messageId,
      })
    }
  }

  return replies
}

