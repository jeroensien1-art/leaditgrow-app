import { PillarPage } from '@/components/pillar-page'

export default function SysteemOpAutopilotPage() {
  return (
    <PillarPage
      eyebrow={['Het resultaat', 'The result']}
      headline={['Systeem op autopilot.', 'System on autopilot.']}
      pain={[
        'Zolang jouw bedrijf draait op jouw persoonlijke aanwezigheid, groeit het maar zo snel als jouw agenda toelaat. Constante druk is geen groeistrategie.',
        'As long as your business runs on your personal presence, it only grows as fast as your calendar allows. Constant pressure is not a growth strategy.',
      ]}
      principle={[
        'Een commercieel systeem trekt leads aan, volgt ze op en converteert ze, los van of jij op dat moment beschikbaar bent. Dat is het verschil tussen 4 weken constante druk en een bedrijf dat losstaat van jouw persoonlijke aanwezigheid.',
        'A commercial system attracts, follows up with, and converts leads, whether or not you are personally available at that moment. That is the difference between 4 weeks of constant pressure and a business that no longer depends on your personal presence.',
      ]}
      ctaLabel={['Ontdek hoe wij dit voor jou automatiseren', 'Discover how we automate this for you']}
      ctaHref="/diagnostic"
      faqs={[
        {
          q: ["Wat betekent 'systeem op autopilot'?", "What does 'system on autopilot' mean?"],
          a: [
            'Het betekent dat leads worden aangetrokken, opgevolgd en geconverteerd door een commercieel systeem, ongeacht of jij op dat moment beschikbaar bent.',
            'It means leads are attracted, followed up with, and converted by a commercial system, whether or not you are personally available at that moment.',
          ],
        },
        {
          q: ['Hoe lang duurt het om zo een systeem op te zetten?', 'How long does it take to set up a system like this?'],
          a: [
            "De meeste klanten zien binnen 4 weken het verschil tussen constante druk en een systeem dat op autopilot draait.",
            'Most clients see the difference between constant pressure and a system running on autopilot within 4 weeks.',
          ],
        },
      ]}
    />
  )
}
