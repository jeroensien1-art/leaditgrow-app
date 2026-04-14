import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Jeroen | Lead it, Grow <jeroen@leaditgrow.be>'
const NOTIFY = 'jeroen@leaditgrow.be'

export async function sendToLead(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  await resend.emails.send({ from: FROM, to, subject, html })
}

export async function notifyJeroen(
  leadName: string,
  leadEmail: string,
  score: number,
  qualified: boolean,
  summary: string
): Promise<void> {
  const html = `
    <h2 style="font-family:sans-serif;color:#3d3929">New lead: ${leadName}</h2>
    <p style="font-family:sans-serif;color:#535146"><strong>Email:</strong> ${leadEmail}</p>
    <p style="font-family:sans-serif;color:#535146"><strong>Score:</strong> ${score}/10 - ${qualified ? '✅ Qualified' : '⚠️ Not yet qualified'}</p>
    <p style="font-family:sans-serif;color:#535146"><strong>Summary:</strong> ${summary}</p>
    <p style="font-family:sans-serif;margin-top:24px">
      <a href="https://docs.google.com/spreadsheets/d/1_vpzI5Fk4hipaN1x7IHHqpuKcn7X1SeA5umuQlS-hpk" style="color:#c96442">View in tracker</a>
    </p>
  `
  await resend.emails.send({
    from: FROM,
    to: NOTIFY,
    subject: `New lead (${score}/10): ${leadName}`,
    html,
  })
}
