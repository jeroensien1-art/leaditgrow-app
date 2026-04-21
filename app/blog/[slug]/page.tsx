import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { headers } from 'next/headers'
import { getAllSlugs, getLocalizedPost } from '@/lib/blog'
import { Nav } from '@/components/nav'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

async function getLangFromHost(): Promise<'nl' | 'en'> {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  return host.includes('leaditgrow.com') ? 'en' : 'nl'
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const lang = await getLangFromHost()
  const post = getLocalizedPost(slug, lang)
  if (!post) return {}
  const baseUrl = lang === 'en' ? 'https://leaditgrow.com' : 'https://leaditgrow.be'
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `${baseUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.publishDate,
      url: `${baseUrl}/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lang = await getLangFromHost()
  const post = getLocalizedPost(slug, lang)
  if (!post) notFound()

  const locale = lang === 'en' ? 'en-GB' : 'nl-BE'
  const date = new Date(post.publishDate).toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const minRead = lang === 'en' ? 'min read' : 'min lezen'
  const backLabel = lang === 'en' ? 'All articles' : 'Alle artikels'

  const cta = lang === 'en'
    ? { label: 'Free · 4 minutes', title: 'Discover where your business stands today.', body: 'The free diagnostic maps out in 4 minutes which of the 7 growth levers in your business are blocked. Direct insight. No sales call.', btn: 'Start the free diagnostic' }
    : { label: 'Gratis · 4 minuten', title: 'Ontdek waar jouw bedrijf vandaag staat.', body: 'De gratis diagnose brengt in 4 minuten in kaart welke van de 7 groeihefbomen in jouw bedrijf op slot staan. Direct inzicht. Geen verkoopsgesprek.', btn: 'Start de gratis diagnose' }

  return (
    <>
      <Nav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schema) }}
      />

      <main style={{ background: '#faf9f5', minHeight: '100vh', paddingTop: '6rem' }}>

        {/* HERO */}
        <div style={{ background: 'linear-gradient(160deg, #0a1e10 0%, #163320 100%)', padding: '4rem 1.5rem 5rem' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <Link
              href="/blog"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(250,249,245,0.4)', textDecoration: 'none', marginBottom: '2rem' }}
            >
              <ArrowLeft size={12} /> Blog
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96442', background: 'rgba(201,100,66,0.12)', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(201,100,66,0.2)' }}>
                {post.category}
              </span>
              {post.region && (
                <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,249,245,0.5)', background: 'rgba(250,249,245,0.08)', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(250,249,245,0.12)' }}>
                  {post.region}
                </span>
              )}
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(250,249,245,0.3)' }}>
                {date} · {post.readingTime} {minRead}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, lineHeight: 1.15, color: '#faf9f5', margin: 0 }}>
              {post.title}
            </h1>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* CTA */}
          <div style={{ marginTop: '4rem', padding: '2.5rem', borderRadius: '16px', background: '#0a1e10', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>
              {cta.label}
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 400, color: '#faf9f5', marginBottom: '1rem', lineHeight: 1.2 }}>
              {cta.title}
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(250,249,245,0.55)', lineHeight: 1.65, marginBottom: '1.75rem', maxWidth: '420px', margin: '0 auto 1.75rem' }}>
              {cta.body}
            </p>
            <Link
              href="/diagnostic"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '999px', background: '#c96442', color: '#fff', fontWeight: 600, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(201,100,66,0.4)' }}
            >
              {cta.btn} <ArrowRight size={16} />
            </Link>
          </div>

          {/* BACK */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(61,57,41,0.1)' }}>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#83827d', textDecoration: 'none' }}>
              <ArrowLeft size={14} /> {backLabel}
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-xs" style={{ background: '#051209', color: 'rgba(250,249,245,0.3)' }}>
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.com · leaditgrow.be
      </footer>
    </>
  )
}
