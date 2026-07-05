import { PillarPage } from '@/components/pillar-page'

export default function KanaalOpschalenPage() {
  return (
    <PillarPage
      eyebrow={['Groeihefboom · Acquire', 'Growth lever · Acquire']}
      headline={['Beste kanaal opschalen.', 'Scaling your best channel.']}
      pain={[
        'Er zomaar op los adverteren op een nieuw kanaal voelt als vooruitgang, maar zonder bewijs dat het werkt, is het gokken met je marketingbudget.',
        'Throwing money at a new channel feels like progress, but without proof it works, it is gambling with your marketing budget.',
      ]}
      principle={[
        'Schaal alleen wat al bewezen converteert. Een nieuw kanaal test je met maximaal 10% van je budget, als experiment, niet als gok op je hele groei.',
        'Only scale what already converts. Test a new channel with a maximum of 10% of your budget, as an experiment, not a bet on your entire growth.',
      ]}
      ctaLabel={['Bekijk welk kanaal ik eerst moet opschalen', 'Find out which channel to scale first']}
      ctaHref="/diagnostic"
      faqs={[
        {
          q: ['Hoe weet ik welk kanaal ik moet opschalen?', 'How do I know which channel to scale?'],
          a: [
            'Kijk naar welk kanaal nu al de laagste kost per klant en de hoogste conversie oplevert. Dat kanaal schaal je eerst, voor je een nieuw kanaal test.',
            'Look at which channel already delivers the lowest cost per customer and the highest conversion. Scale that channel first, before testing a new one.',
          ],
        },
        {
          q: ['Hoeveel budget zet ik op een nieuw kanaal?', 'How much budget should I put on a new channel?'],
          a: [
            'Maximaal 10% van je marketingbudget. Een nieuw kanaal is een experiment, geen gok op je hele groei.',
            'A maximum of 10% of your marketing budget. A new channel is an experiment, not a bet on your entire growth.',
          ],
        },
      ]}
    />
  )
}
