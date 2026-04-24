/**
 * Gmail REST API helper — reads unread replies, marks as read.
 * No extra npm package: uses plain fetch + existing OAuth2 refresh token.
 */

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
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GMAIL_CLIENT_ID!,
      client_secret: process.env.GMAIL_CLIENT_SECRET!,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
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

export async function getUnreadReplies(): Promise<GmailReply[]> {
  const token = await getAccessToken()
  const auth = { Authorization: `Bearer ${token}` }

  // Unread inbox messages NOT sent by us
  const listRes = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages' +
    '?q=is:unread+in:inbox+-from:jeroen%40leaditgrow.be&maxResults=10',
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
    if (!inReplyTo) continue  // not a reply

    // Check the thread has at least one message from us
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

    const from = header(hdrs, 'From')
    const emailMatch = from.match(/<(.+?)>/)
    const fromEmail = emailMatch ? emailMatch[1] : from.trim()

    const subject = header(hdrs, 'Subject')
    const rawText = extractPlainText(msgData.payload)
    const text = stripQuotedText(rawText)

    // Original subject = first message in thread
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
  }

  return replies
}

export async function markAsRead(messageId: string): Promise<void> {
  const token = await getAccessToken()
  await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ removeLabelIds: ['UNREAD'] }),
    }
  )
}
