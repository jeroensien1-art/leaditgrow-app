import Link from 'next/link'
import type { Metadata } from 'next'
import { posts } from '@/lib/blog/posts'
import { Nav } from '@/components/nav'

export const metadata: Metadata = {
  title: 'Blog — Groei, leiderschap en systemen voor Vlaamse ondernemers | Lead it, Grow',
  description: 'Praktische inzichten voor zaakvoerders in Antwerpen, Gent en Vlaanderen. Over groeisystemen, leiderschap en leads binnenbrengen op autopilot.',
  alternates: {
    canonical: 'https://leaditgrow.be/blog',
  },
}

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main style={{ background: '#faf9f5', minHeight: '100vh', paddingTop: '6rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 1.5rem' }}>

          <div
            style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c96442', marginBottom: '1rem' }}
          >
            Blog
          </div>

          <h1
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.1, color: '#0a1e10', marginBottom: '1rem' }}
          >
            Laatste inzichten<br /><em style={{ color: '#c96442' }}>voor ondernemers</em>
          </h1>

          <p style={{ fontSize: '17px', color: '#83827d', lineHeight: 1.7, marginBottom: '3.5rem', maxWidth: '520px' }}>
            Over groeisystemen, leiderschap en leads binnenbrengen op autopilot.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', borderTop: '1px solid rgba(61,57,41,0.1)' }}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article
                  className="blog-list-item"
                  style={{
                    padding: '2rem 0',
                    borderBottom: '1px solid rgba(61,57,41,0.1)',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span
                      style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96442', background: 'rgba(201,100,66,0.08)', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(201,100,66,0.2)' }}
                    >
                      {post.category}
                    </span>
                    {post.region && (
                      <span
                        style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#535146', background: 'rgba(61,57,41,0.06)', padding: '3px 10px', borderRadius: '999px', border: '1px solid rgba(61,57,41,0.12)' }}
                      >
                        {post.region}
                      </span>
                    )}
                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#b4b2a7' }}>
                      {post.readingTime} min lezen
                    </span>
                  </div>
                  <h2
                    style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 400, lineHeight: 1.25, color: '#0a1e10', marginBottom: '0.75rem' }}
                  >
                    {post.title}
                  </h2>
                  <p style={{ fontSize: '15px', color: '#83827d', lineHeight: 1.65, margin: 0 }}>
                    {post.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-xs" style={{ background: '#051209', color: 'rgba(250,249,245,0.3)' }}>
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.com · leaditgrow.be
      </footer>
    </>
  )
}
