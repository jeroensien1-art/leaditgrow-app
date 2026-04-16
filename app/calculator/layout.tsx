import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Revenue Calculator — Hoeveel omzet mis jij door trage opvolging? | Lead it, Grow',
  description: 'Bereken in 2 minuten hoeveel omzet jouw bedrijf maandelijks misloopt door trage leadopvolging. Gratis tool voor Vlaamse ondernemers.',
  alternates: {
    canonical: 'https://leaditgrow.be/calculator',
  },
  openGraph: {
    title: 'Revenue Calculator — Hoeveel omzet mis jij door trage opvolging? | Lead it, Grow',
    description: 'Bereken in 2 minuten hoeveel omzet jouw bedrijf maandelijks misloopt door trage leadopvolging.',
    url: 'https://leaditgrow.be/calculator',
    type: 'website',
  },
}

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children
}
