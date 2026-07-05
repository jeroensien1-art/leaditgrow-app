import { PillarPage } from '@/components/pillar-page'

export default function AiAgentsPage() {
  return (
    <PillarPage
      eyebrow={['Groeihefboom · Multiply', 'Growth lever · Multiply']}
      headline={['AI agents.', 'AI agents.']}
      pain={[
        'Jij kan niet 24/7 telefoons opnemen, mails beantwoorden en offertes opvolgen. Elke minuut die daaraan opgaat, is een minuut die niet naar leiderschap of strategie gaat.',
        'You cannot answer calls, reply to emails, and follow up on quotes 24/7. Every minute spent on that is a minute not spent on leadership or strategy.',
      ]}
      principle={[
        'Een AI agent kent jouw bedrijf, antwoordt in jouw stijl, en is gekoppeld aan je CRM, agenda en offertes. Klanten voelen zich geholpen, ook als jij even niet beschikbaar bent.',
        'An AI agent knows your business, responds in your voice, and connects to your CRM, calendar, and quotes. Customers feel helped, even when you are not available.',
      ]}
      ctaLabel={['Test mijn AI agent 14 dagen gratis', 'Try my AI agent free for 14 days']}
      ctaHref="/calculator"
      faqs={[
        {
          q: ['Wat is een AI agent?', 'What is an AI agent?'],
          a: [
            'Een AI agent is een geautomatiseerde assistent die jouw bedrijf kent, reageert op mails, WhatsApp en telefoons in jouw stijl, en gekoppeld is aan je CRM, agenda en offertes.',
            'An AI agent is an automated assistant that knows your business, responds to emails, WhatsApp, and calls in your voice, and connects to your CRM, calendar, and quotes.',
          ],
        },
        {
          q: ['Vervangt een AI agent mijn team?', 'Does an AI agent replace my team?'],
          a: [
            'Nee. Een AI agent vangt de eerste reactie en opvolging op zodat niets blijft liggen. Jouw team neemt het gesprek over zodra het menselijke beslissingen vereist.',
            'No. An AI agent catches the first response and follow-up so nothing falls through the cracks. Your team takes over the conversation once it requires a human decision.',
          ],
        },
      ]}
    />
  )
}
