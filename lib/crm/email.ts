import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Jeroen | Lead it, Grow <jeroen@leaditgrow.be>'
const NOTIFY = 'jeroen@leaditgrow.be'
const SITE = 'https://leaditgrow.be'

export async function sendWelcomeEmail(name: string, to: string): Promise<void> {
  const firstName = name.split(' ')[0]
  const downloadUrl = `${SITE}/downloads/actiehandboek.pdf`
  const upsellUrl = `${SITE}/actiehandboek`

  const html = `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(61,57,41,0.1);">

        <!-- Header -->
        <tr><td style="background:#3d3929;padding:32px 40px;">
          <p style="margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(250,249,245,0.4);font-family:monospace;">Lead it, Grow</p>
          <h1 style="margin:12px 0 0;font-size:26px;font-weight:400;color:#faf9f5;line-height:1.2;font-family:Georgia,serif;">
            Hier is jouw<br><em style="color:#c96442;">gratis actiehandboek</em>
          </h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#535146;">
            Hoi ${firstName},
          </p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#535146;">
            Zoals beloofd: het Businessgroei Actiehandboek staat klaar. Klik hieronder om te downloaden.
          </p>

          <!-- CTA button -->
          <table cellpadding="0" cellspacing="0" style="margin:28px 0;">
            <tr><td style="background:#c96442;border-radius:50px;">
              <a href="${downloadUrl}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">
                Download het actiehandboek →
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#535146;">
            <strong>Wat je als eerste moet lezen:</strong>
          </p>
          <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:1.8;color:#535146;">
            <li>Hoofdstuk 2 — De 5-minutenregel (pagina 18): dit is het één ding dat de meeste ondernemers direct 21× meer deals oplevert.</li>
            <li>De 7-hefboomdiagnose voorin: scoor jezelf voor je begint, zo weet je precies waar je de meeste winst kunt halen.</li>
            <li>Het 30-dagenplan achteraan: kopieer week 1 direct naar je agenda.</li>
          </ul>

          <hr style="border:none;border-top:1px solid rgba(61,57,41,0.1);margin:28px 0;">

          <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#83827d;">
            <strong style="color:#535146;">PS.</strong> Als je het handboek wil implementeren maar liever niet alleen — ik help een beperkt aantal ondernemers per kwartaal persoonlijk. Geen grote groepsprogramma's, gewoon jouw systeem opbouwen in 4 weken.
          </p>
          <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:#83827d;">
            Meer weten? <a href="${upsellUrl}" style="color:#c96442;text-decoration:underline;">Bekijk de volledige aanpak hier.</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;background:#f5f3ee;border-top:1px solid rgba(61,57,41,0.08);">
          <p style="margin:0;font-size:12px;color:#83827d;line-height:1.6;">
            Jeroen · Lead it, Grow · <a href="https://leaditgrow.be" style="color:#83827d;">leaditgrow.be</a><br>
            <a href="mailto:jeroen@leaditgrow.be" style="color:#83827d;">jeroen@leaditgrow.be</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  await resend.emails.send({
    from: FROM,
    to,
    subject: `${firstName}, hier is jouw gratis actiehandboek`,
    html,
  })
}

export async function notifyJeroenNewOptin(name: string, email: string): Promise<void> {
  const html = `
    <h2 style="font-family:sans-serif;color:#3d3929">Nieuwe gratis opt-in: ${name}</h2>
    <p style="font-family:sans-serif;color:#535146"><strong>Email:</strong> ${email}</p>
    <p style="font-family:sans-serif;color:#535146"><strong>Bron:</strong> Meta Ads — gratis-handboek landingspagina</p>
    <p style="font-family:sans-serif;color:#535146"><strong>Welkomstmail verstuurd.</strong> Download-link meegegeven.</p>
    <p style="font-family:sans-serif;margin-top:24px">
      <a href="https://docs.google.com/spreadsheets/d/1_vpzI5Fk4hipaN1x7IHHqpuKcn7X1SeA5umuQlS-hpk" style="color:#c96442">Bekijk in tracker</a>
    </p>
  `
  await resend.emails.send({
    from: FROM,
    to: NOTIFY,
    subject: `Nieuwe opt-in (gratis handboek): ${name}`,
    html,
  })
}

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
