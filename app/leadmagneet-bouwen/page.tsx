import { PillarPage } from '@/components/pillar-page'

export default function LeadmagneetBouwenPage() {
  return (
    <PillarPage
      eyebrow={['Groeihefboom · Capture', 'Growth lever · Capture']}
      headline={['Leadmagneet bouwen.', 'Building a lead magnet.']}
      pain={[
        '60 tot 80% van je websitebezoekers vertrekt zonder een spoor achter te laten. Geen contactgegevens betekent geen opvolging, en geen opvolging betekent een verloren klant.',
        '60 to 80% of your website visitors leave without a trace. No contact details means no follow-up, and no follow-up means a lost customer.',
      ]}
      principle={[
        'Een leadmagneet ruilt iets waardevols (een checklist, calculator of rapport) tegen een e-mailadres. Zo verander je een anonieme bezoeker in een lead die je kan opvolgen, ook als die nu nog niet koopt.',
        'A lead magnet trades something valuable (a checklist, calculator, or report) for an email address. That turns an anonymous visitor into a lead you can follow up with, even if they are not ready to buy yet.',
      ]}
      ctaLabel={['Bouw mijn leadmagneet mee', 'Help me build my lead magnet']}
      ctaHref="/#contact"
      faqs={[
        {
          q: ['Wat is een leadmagneet?', 'What is a lead magnet?'],
          a: [
            'Een leadmagneet is iets waardevols dat je gratis weggeeft, zoals een checklist, calculator of rapport, in ruil voor een e-mailadres, zodat je een bezoeker kan opvolgen.',
            'A lead magnet is something valuable you give away for free, such as a checklist, calculator, or report, in exchange for an email address, so you can follow up with a visitor.',
          ],
        },
        {
          q: ['Welke leadmagneet werkt het beste?', 'Which lead magnet works best?'],
          a: [
            'De leadmagneet die het snelste, concrete resultaat belooft rond het probleem waar je bezoeker nu mee zit, werkt het beste. Een calculator of diagnose scoort vaak hoger dan een algemene gids.',
            'The lead magnet that promises the fastest, most concrete result around the problem your visitor has right now works best. A calculator or diagnostic often outperforms a general guide.',
          ],
        },
      ]}
    />
  )
}
