import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diensten — Groeisystemen voor Vlaamse ondernemers | Lead it, Grow',
  description: 'Van geautomatiseerde leadopvolging tot een volledig groeisysteem. Ontdek hoe Lead it, Grow zaakvoerders in Antwerpen en Gent helpt groeien met systeem en strategie.',
  alternates: {
    canonical: 'https://leaditgrow.be/diensten',
  },
  openGraph: {
    title: 'Diensten — Groeisystemen voor Vlaamse ondernemers | Lead it, Grow',
    description: 'Van geautomatiseerde leadopvolging tot een volledig groeisysteem. Ontdek hoe Lead it, Grow zaakvoerders in Antwerpen en Gent helpt groeien.',
    url: 'https://leaditgrow.be/diensten',
    type: 'website',
  },
}

export default function DienstenLayout({ children }: { children: React.ReactNode }) {
  return children
}
