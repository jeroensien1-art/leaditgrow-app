import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { join } from 'path'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const TEMPLATE_PATH = join(
  'C:\\Users\\Jeroe\\Documents\\Projecten\\1. MyBusinessStrategy CLAUDE\\my-agency-starter-kit\\exports',
  'bd-manual-template.md'
)

export interface DiagnosticSubmission {
  name: string
  email: string
  context: {
    industry: string
    monthlyLeads: string
    avgDealValue: string
    teamSize: string
  }
  answers: Record<string, number>  // lever → score 0-3
  score: number                     // 0-100
  topLevers: string[]               // sorted worst first
}

const leverLabels: Record<string, string> = {
  time: 'Owner time / ability to switch off',
  leadership: 'Leadership and team autonomy',
  speed_to_lead: 'Speed-to-lead (response time to new enquiries)',
  pipeline: 'Pipeline follow-up and nurture',
  marketing: 'Online presence / inbound generation',
  sales: 'Sales close rate',
  retention: 'Client retention and referrals',
}

function estimateRevenueLeak(submission: DiagnosticSubmission): string {
  const { monthlyLeads, avgDealValue } = submission.context

  const leadsMap: Record<string, number> = {
    'Fewer than 5': 3,
    '5 to 20': 12,
    '20 to 50': 35,
    'More than 50': 65,
  }
  const dealMap: Record<string, number> = {
    'Under €1,000': 600,
    '€1,000 to €5,000': 2500,
    '€5,000 to €20,000': 10000,
    'Over €20,000': 25000,
  }

  const leads = leadsMap[monthlyLeads] ?? 10
  const deal = dealMap[avgDealValue] ?? 2000

  // Speed-to-lead score: responding late loses ~40-70% of leads at score 2-3
  const stlScore = submission.answers['speed_to_lead'] ?? 0
  const pipelineScore = submission.answers['pipeline'] ?? 0
  const salesScore = submission.answers['sales'] ?? 0

  const stlLoss = stlScore === 3 ? 0.5 : stlScore === 2 ? 0.3 : stlScore === 1 ? 0.1 : 0
  const pipelineLoss = pipelineScore === 3 ? 0.4 : pipelineScore === 2 ? 0.25 : pipelineScore === 1 ? 0.1 : 0
  const salesLoss = salesScore === 3 ? 0.35 : salesScore === 2 ? 0.2 : salesScore === 1 ? 0.08 : 0

  const totalLossRate = Math.min(stlLoss + pipelineLoss + salesLoss, 0.85)
  const monthlyLeak = Math.round(leads * deal * totalLossRate / 500) * 500  // round to nearest 500

  return monthlyLeak > 0
    ? `€${monthlyLeak.toLocaleString('nl-BE')}/month in recoverable revenue`
    : 'minimal — your systems are already working well'
}

export async function generateDiagnosticReport(submission: DiagnosticSubmission): Promise<{ subject: string; html: string }> {
  let template = ''
  try {
    template = readFileSync(TEMPLATE_PATH, 'utf8')
  } catch {
    template = 'Template not available — generate the full plan from scratch.'
  }

  const revenueLeak = estimateRevenueLeak(submission)

  const topLeverDescriptions = submission.topLevers
    .slice(0, 3)
    .map((l, i) => `${i + 1}. ${leverLabels[l] ?? l} — score: ${submission.answers[l] ?? 0}/3 (${submission.answers[l] === 3 ? 'critical' : submission.answers[l] === 2 ? 'significant gap' : submission.answers[l] === 1 ? 'minor gap' : 'strong'})`)
    .join('\n')

  const allAnswers = Object.entries(submission.answers)
    .map(([k, v]) => `- ${leverLabels[k] ?? k}: ${v}/3`)
    .join('\n')

  const prompt = `You are Jeroen from Lead it, Grow — a BD systems and growth consultancy. You are generating a personalised diagnostic report for a business owner who just completed the Business Impact Diagnostic.

Here is the manual template you must use as the structural foundation:
---TEMPLATE START---
${template}
---TEMPLATE END---

Here is the business owner's data:

NAME: ${submission.name}
BUSINESS TYPE: ${submission.context.industry}
MONTHLY LEADS: ${submission.context.monthlyLeads}
AVERAGE DEAL VALUE: ${submission.context.avgDealValue}
TEAM SIZE: ${submission.context.teamSize}
OVERALL SCORE: ${submission.score}/100
ESTIMATED REVENUE LEAK: ${revenueLeak}

DIAGNOSTIC ANSWERS (0=strong, 3=critical gap):
${allAnswers}

TOP 3 PRIORITIES (worst gaps first):
${topLeverDescriptions}

TODAY'S DATE: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

INSTRUCTIONS:
1. Generate a full personalised HTML email report using the template as your structure
2. Replace every [PLACEHOLDER] with specific, relevant content for this business owner
3. The top 3 fixes must match their actual top 3 scoring levers — not generic advice
4. Calculate and mention their specific revenue leak figure prominently
5. Include niche-specific language based on their industry type
6. Keep the tone: warm, direct, confident — like a sharp advisor who respects the reader's time. No hollow phrases.
7. At the end, include a CTA to book a free intro call by replying to this email (no Calendly link — just "reply to this email")
8. The report is FREE. Do not mention a price in the report itself.
9. HTML email format: inline styles, clean, professional. Max width 600px. Use #c96442 as accent color, #faf9f5 as background, #3d3929 for headings.
10. Sign as: Jeroen, Lead it, Grow — jeroen@leaditgrow.be

Respond with valid JSON only:
{
  "subject": "<email subject — personal, includes their name and top gap>",
  "html": "<full HTML email body>"
}`

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4000,
    system: 'You are Jeroen from Lead it, Grow. Generate personalised diagnostic reports as instructed. Respond with valid JSON only.',
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content.find(b => b.type === 'text')?.text ?? ''
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as { subject: string; html: string }
}
