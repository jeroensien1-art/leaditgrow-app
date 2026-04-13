import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getPost, getAllSlugs } from '@/lib/blog/posts'
import { Nav } from '@/components/nav'

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `https://leaditgrow.be/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.publishDate,
      url: `https://leaditgrow.be/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const date = new Date(post.publishDate).toLocaleDateString('nl-BE', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <>
      <Nav />

      {/* JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.schema) }}
      />

      <main style={{ background: '#faf9f5', minHeight: '100vh', paddingTop: '6rem' }}>

        {/* ── HERO ── */}
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
                {date} · {post.readingTime} min lezen
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, lineHeight: 1.15, color: '#faf9f5', margin: 0 }}>
              {post.title}
            </h1>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ── CTA ── */}
          <div style={{ marginTop: '4rem', padding: '2.5rem', borderRadius: '16px', background: '#0a1e10', textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}>
              Gratis · 4 minuten
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 400, color: '#faf9f5', marginBottom: '1rem', lineHeight: 1.2 }}>
              Ontdek waar jouw bedrijf vandaag staat.
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(250,249,245,0.55)', lineHeight: 1.65, marginBottom: '1.75rem', maxWidth: '420px', margin: '0 auto 1.75rem' }}>
              De gratis diagnose brengt in 4 minuten in kaart welke van de 7 groeihefbomen in jouw bedrijf op slot staan. Direct inzicht. Geen verkoopsgesprek.
            </p>
            <Link
              href="/diagnostic"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '999px', background: '#c96442', color: '#fff', fontWeight: 600, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(201,100,66,0.4)' }}
            >
              Start de gratis diagnose <ArrowRight size={16} />
            </Link>
          </div>

          {/* ── BACK ── */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(61,57,41,0.1)' }}>
            <Link
              href="/blog"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#83827d', textDecoration: 'none' }}
            >
              <ArrowLeft size={14} /> Alle artikels
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
