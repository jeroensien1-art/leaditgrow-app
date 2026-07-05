import { PillarPage } from '@/components/pillar-page'

export default function WebsiteCroPage() {
  return (
    <PillarPage
      eyebrow={['Groeihefboom · Convert', 'Growth lever · Convert']}
      headline={['Website CRO.', 'Website CRO.']}
      pain={[
        'Je website trekt bezoekers, maar de meesten vertrekken zonder actie. Meer traffic kopen lost dat niet op: een lekkende pagina blijft lekken, hoeveel bezoekers je er ook op stuurt.',
        'Your website attracts visitors, but most leave without taking action. Buying more traffic will not fix that: a leaking page keeps leaking, no matter how many visitors you send to it.',
      ]}
      principle={[
        'Conversion Rate Optimisation verhoogt het percentage bezoekers dat converteert. Van 25 naar 35% conversie bouwt vaak meer omzet dan een verdubbeling van je advertentiebudget, en het is goedkoper.',
        'Conversion Rate Optimisation increases the percentage of visitors who convert. Going from 25% to 35% conversion often builds more revenue than doubling your ad budget, and it is cheaper.',
      ]}
      ctaLabel={['Vraag een gratis CRO-scan van mijn website', 'Request a free CRO scan of my website']}
      ctaHref="/#contact"
      faqs={[
        {
          q: ['Wat is CRO?', 'What is CRO?'],
          a: [
            'CRO (Conversion Rate Optimisation) is het proces om het percentage bezoekers dat een gewenste actie onderneemt op je website te verhogen, zonder meer traffic te kopen.',
            'CRO (Conversion Rate Optimisation) is the process of increasing the percentage of visitors who take a desired action on your website, without buying more traffic.',
          ],
        },
        {
          q: ['Moet ik eerst CRO doen of meer adverteren?', 'Should I do CRO first or advertise more?'],
          a: [
            'Eerst CRO. Meer bezoekers sturen naar een pagina die niet converteert, vergroot alleen het verlies. Fix de pipeline eerst, open dan pas de kraan.',
            'CRO first. Sending more visitors to a page that does not convert only grows the loss. Fix the pipeline first, then open the tap.',
          ],
        },
      ]}
    />
  )
}
