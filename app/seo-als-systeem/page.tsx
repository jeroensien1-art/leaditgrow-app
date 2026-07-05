import { PillarPage } from '@/components/pillar-page'

export default function SeoAlsSysteemPage() {
  return (
    <PillarPage
      eyebrow={['Groeihefboom · Compound', 'Growth lever · Compound']}
      headline={['SEO als systeem.', 'SEO as a system.']}
      pain={[
        'SEO en video leveren pas rendement op na 12 tot 18 maanden. De meeste bedrijven stoppen ervoor, precies wanneer het zou beginnen te renderen.',
        'SEO and video only pay off after 12 to 18 months. Most businesses quit before that point, right when it would start paying off.',
      ]}
      principle={[
        'SEO wordt pas een systeem als je structureel en geduldig bouwt: content, techniek en autoriteit die samen blijven groeien. Het is de groeihefboom die je concurrenten inhaalt terwijl jij slaapt.',
        'SEO only becomes a system when you build it structurally and patiently: content, technical foundations, and authority that keep compounding together. It is the growth lever that overtakes your competitors while you sleep.',
      ]}
      ctaLabel={['Start mijn SEO-systeem', 'Start my SEO system']}
      ctaHref="/#contact"
      faqs={[
        {
          q: ['Waarom duurt SEO zo lang voor het resultaat oplevert?', 'Why does SEO take so long to pay off?'],
          a: [
            'Zoekmachines bouwen vertrouwen in je website op via consistente content, techniek en autoriteit over tijd. Dat proces duurt doorgaans 12 tot 18 maanden voor het zich vertaalt in stabiele posities.',
            'Search engines build trust in your website through consistent content, technical foundations, and authority over time. That process typically takes 12 to 18 months before it translates into stable rankings.',
          ],
        },
        {
          q: ['Is SEO het nog waard als het zo lang duurt?', 'Is SEO still worth it if it takes that long?'],
          a: [
            'Ja, omdat het effect compoundeert: eenmaal opgebouwd, blijft SEO-traffic binnenkomen zonder dat je per klik betaalt, in tegenstelling tot advertenties.',
            'Yes, because the effect compounds: once built, SEO traffic keeps coming in without paying per click, unlike ads.',
          ],
        },
      ]}
    />
  )
}
