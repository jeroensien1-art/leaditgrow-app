import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gratis Groeidiagnose — Ontdek wat jouw bedrijf tegenhoudt | Lead it, Grow',
  description: 'In 4 minuten breng je in kaart welke van de 7 groeihefbomen in jouw bedrijf op slot staan. Gratis. Geen verkoopsgesprek. Direct bruikbaar inzicht.',
  alternates: {
    canonical: 'https://leaditgrow.be/diagnostic',
  },
  openGraph: {
    title: 'Gratis Groeidiagnose — Ontdek wat jouw bedrijf tegenhoudt | Lead it, Grow',
    description: 'In 4 minuten breng je in kaart welke van de 7 groeihefbomen in jouw bedrijf op slot staan. Gratis. Geen verkoopsgesprek.',
    url: 'https://leaditgrow.be/diagnostic',
    type: 'website',
  },
}

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return children
}
