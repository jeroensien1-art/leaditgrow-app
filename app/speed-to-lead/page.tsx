import { PillarPage } from '@/components/pillar-page'

export default function SpeedToLeadPage() {
  return (
    <PillarPage
      eyebrow={['Groeihefboom · Foundation', 'Growth lever · Foundation']}
      headline={['Speed-to-lead.', 'Speed-to-lead.']}
      pain={[
        '78% van de deals gaat naar wie het eerst reageert. Duurt jouw antwoord langer dan 5 minuten, dan is de kans op conversie al met 80% gedaald.',
        '78% of deals go to whoever responds first. If your reply takes longer than 5 minutes, your conversion odds have already dropped by 80%.',
      ]}
      principle={[
        'Een geautomatiseerd opvolgsysteem reageert op elke aanvraag, stelt tijdslots voor en houdt de lead warm tot jij het gesprek overneemt. Jij hoeft niet non-stop bereikbaar te zijn om toch als eerste te antwoorden.',
        'An automated follow-up system responds to every enquiry, proposes time slots, and keeps the lead warm until you take over the conversation. You do not need to be available around the clock to still respond first.',
      ]}
      ctaLabel={['Test 14 dagen gratis het speed-to-lead systeem', 'Try the speed-to-lead system free for 14 days']}
      ctaHref="/calculator"
      faqs={[
        {
          q: ['Wat is speed-to-lead?', 'What is speed-to-lead?'],
          a: [
            'Speed-to-lead is de tijd tussen het moment dat een lead contact opneemt en het moment dat jij reageert. Hoe korter die tijd, hoe hoger de kans dat die lead klant wordt.',
            'Speed-to-lead is the time between the moment a lead makes contact and the moment you respond. The shorter that time, the higher the odds that lead becomes a customer.',
          ],
        },
        {
          q: ['Hoe snel moet ik reageren op een nieuwe lead?', 'How fast should I respond to a new lead?'],
          a: [
            'Onderzoek van InsideSales toont dat de kans op conversie met 80% daalt als je langer dan 5 minuten wacht met reageren. Binnen 1 minuut reageren geeft de hoogste conversiekans.',
            'Research from InsideSales shows conversion odds drop by 80% once you wait longer than 5 minutes to respond. Responding within 1 minute gives the highest conversion odds.',
          ],
        },
      ]}
    />
  )
}
