import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface Lead {
  id: string
  name: string
  email: string
  message: string
  lang: 'nl' | 'en'
  submittedAt: number       // unix ms
  repliedAt?: number
  followedUpAt?: number
  qualified: boolean
  score: number
  status: 'new' | 'replied' | 'followed_up' | 'booked' | 'closed'
}

export interface QualificationResult {
  score: number             // 1-10
  qualified: boolean        // true if score >= 6
  lang: 'nl' | 'en'
  summary: string           // 1-line summary of the lead
  painPoints: string[]      // detected pain points
  emailSubject: string
  emailBody: string         // HTML email body
}

const SYSTEM_PROMPT = `You are Jeroen's AI assistant for Lead it, Grow — a business strategy and growth systems consultancy based in Belgium.

Lead it, Grow helps entrepreneurs build predictable growth engines: BD systems that attract and convert leads automatically, freeing them for leadership, strategy, and their private life.

Jeroen's offer ladder:
- Free: Revenue Calculator (2-min tool, instant insight)
- €97-297: Action Manual (30-day plan, top 3 fixes)
- €997-2500: BD Sprint (done-with-you, 4 weeks, speed-to-lead automation)
- €1500-3500/mo: Done-for-You Retainer (we run the system)
- €5000+: White-Label License (agencies)

Calendly 5-min call link: https://calendly.com/sovereign-now333/free-intro-call-clone

Brand voice: warm, direct, confident — no jargon, no em dashes, no hollow phrases like "I hope this email finds you well". Write like a sharp advisor who respects the reader's time.

ALWAYS detect the language of the incoming message and respond in the same language (NL or EN).`

export async function qualifyAndDraft(lead: Omit<Lead, 'id' | 'submittedAt' | 'qualified' | 'score' | 'status' | 'lang'>): Promise<QualificationResult> {
  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2000,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `A new lead just submitted the contact form on leaditgrow.com.
Today's date: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Name: ${lead.name}
Email: ${lead.email}
Message: ${lead.message}

Do the following and respond with valid JSON only (no markdown, no explanation):
{
  "score": <1-10, how qualified is this lead for Jeroen's services>,
  "qualified": <true if score >= 6>,
  "lang": <"nl" or "en" based on the message language>,
  "summary": "<one sentence describing this lead>",
  "painPoints": ["<pain point 1>", "<pain point 2>"],
  "emailSubject": "<email subject line, personal and specific>",
  "emailBody": "<full HTML email body — warm, direct, personal. Always write as Jeroen, in first person. Propose 3-4 specific time slots across the coming week and the week after. Jeroen is available 10:00-16:00 Lisbon time (WET/WEST). Infer the lead's likely timezone from their language, email domain, or any location signals in their message (e.g. Dutch message or .be/.nl email → CET/CEST = Lisbon +1h in winter, +0h in summer; English with no clear region → show Lisbon time and note the timezone). Show each slot in the lead's local time with the timezone label (e.g. 'Tuesday 14 April at 12:00 CET'). Also ask for their phone number if they prefer a call. No Calendly link. If score >= 6: be enthusiastic and concrete first, then propose times. If score < 6: ask 1-2 short questions first, then propose times. Never use hollow phrases. Sign as Jeroen, Lead it, Grow.>"
}`
      }
    ]
  })

  const text = response.content.find(b => b.type === 'text')?.text ?? ''

  // Strip any accidental markdown fences
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as QualificationResult
}

export async function draftFollowUp(lead: Lead): Promise<{ subject: string; body: string }> {
  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `This lead submitted our contact form 2 hours ago and has not replied yet.

Name: ${lead.name}
Email: ${lead.email}
Original message: ${lead.message}
Qualified: ${lead.qualified} (score: ${lead.score}/10)

Write a short, warm follow-up email in ${lead.lang === 'nl' ? 'Dutch' : 'English'}.
Keep it under 80 words. Do not apologize for following up. Be direct.
${lead.qualified ? 'Include the Calendly 5-min call link.' : 'Ask one simple qualifying question.'}

Respond with valid JSON only:
{
  "subject": "<follow-up subject>",
  "body": "<HTML email body>"
}`
      }
    ]
  })

  const text = response.content.find(b => b.type === 'text')?.text ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}
