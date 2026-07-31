import type { Metadata } from 'next'
import { Nav } from '@/components/nav'
import { FREEBIES, FREEBIE_ORDER } from '@/lib/freebies'
import { FreebieGrid } from './freebie-grid'

export const metadata: Metadata = {
  title: 'Gratis downloads voor zaakvoerders · kaders, templates en checklists | Lead it, Grow',
  description:
    'Zeven gratis hulpmiddelen voor KMO-zaakvoerders: het delegatiekader, een tijdlog-template, de stress-checklist, een promptlijst voor AI, een gespreksgids en twee opvolgtools. Direct in je inbox.',
  alternates: { canonical: 'https://leaditgrow.be/gratis' },
  openGraph: {
    title: 'Gratis downloads voor zaakvoerders | Lead it, Grow',
    description: 'Kaders, templates en checklists die je vandaag nog kan gebruiken. Vul je e-mailadres in en je krijgt ze meteen toegestuurd.',
    type: 'website',
    url: 'https://leaditgrow.be/gratis',
  },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Gratis downloads voor zaakvoerders',
  description:
    'Kaders, templates en checklists voor KMO-zaakvoerders: delegeren, tijdmanagement, ondernemersstress, AI-prompts, moeilijke gesprekken en leadopvolging.',
  url: 'https://leaditgrow.be/gratis',
  publisher: { '@type': 'Organization', name: 'Lead it, Grow', url: 'https://leaditgrow.be' },
  hasPart: FREEBIE_ORDER.map(id => ({
    '@type': 'CreativeWork',
    name: FREEBIES[id].title,
    description: FREEBIES[id].pitch,
    isAccessibleForFree: true,
  })),
}

export default function GratisPage() {
  const items = FREEBIE_ORDER.map(id => FREEBIES[id])

  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main style={{ background: '#faf9f5', minHeight: '100vh', paddingTop: '6rem' }}>
        <div style={{ background: 'linear-gradient(160deg, #0a1e10 0%, #163320 100%)', padding: '4rem 1.5rem 5rem' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>
              Gratis · geen verkoopgesprek
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 400, lineHeight: 1.12, color: '#faf9f5', margin: '0 0 1.25rem' }}>
              Hulpmiddelen die je<br /><em style={{ color: '#c96442' }}>vandaag nog gebruikt</em>
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(250,249,245,0.65)', lineHeight: 1.7, maxWidth: '540px', margin: 0 }}>
              Geen ebooks van veertig pagina&apos;s. Kaders, templates en checklists van één tot vier bladzijden, gemaakt voor zaakvoerders die vandaag iets willen veranderen. Kies wat je nodig hebt, vul je e-mailadres in, en het staat binnen een minuut in je inbox.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '3.5rem 1.5rem 5rem' }}>
          <FreebieGrid items={items} />

          <div style={{ marginTop: '4rem', padding: '2.5rem', borderRadius: '16px', background: '#0a1e10', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>
              Gratis · 4 minuten
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 400, color: '#faf9f5', marginBottom: '1rem', lineHeight: 1.2 }}>
              Weet je niet waar te beginnen?
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(250,249,245,0.55)', lineHeight: 1.65, maxWidth: '440px', margin: '0 auto 1.75rem' }}>
              De gratis diagnose brengt in vier minuten in kaart welke van de zeven groeihefbomen in jouw bedrijf op slot staan. Daarna weet je welke download hierboven de jouwe is.
            </p>
            <a
              href="/diagnostic"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '999px', background: '#c96442', color: '#fff', fontWeight: 600, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(201,100,66,0.4)' }}
            >
              Start de gratis diagnose →
            </a>
          </div>

          <p style={{ marginTop: '2rem', fontSize: '12px', color: '#83827d', textAlign: 'center', lineHeight: 1.7 }}>
            Je krijgt de download per e-mail en daarna af en toe iets bruikbaars over groeisystemen. Uitschrijven kan met één klik, je adres gaat nooit naar derden.
          </p>
        </div>
      </main>

      <footer className="py-8 text-center text-xs" style={{ background: '#051209', color: 'rgba(250,249,245,0.3)' }}>
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.be
      </footer>
    </>
  )
}
