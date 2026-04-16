'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { posts } from '@/lib/blog/posts'

export function BlogScroller() {
  // Duplicate posts for seamless infinite scroll
  const doubled = [...posts, ...posts]

  return (
    <section style={{ background: '#0a1e10', padding: '5rem 0 4rem', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 3rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c96442', marginBottom: '0.75rem' }}>
            Van de blog
          </p>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 400, color: '#faf9f5', margin: 0, lineHeight: 1.15 }}>
            Inzichten voor Vlaamse<br />
            <span style={{ fontStyle: 'italic', color: 'rgba(250,249,245,0.55)' }}>zaakvoerders die willen groeien</span>
          </h2>
        </div>
        <Link
          href="/blog"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c96442', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          Alle artikels <ArrowRight size={12} />
        </Link>
      </div>

      {/* Scrolling track */}
      <div style={{ position: 'relative' }}>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to right, #0a1e10, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', background: 'linear-gradient(to left, #0a1e10, transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div
          className="blog-scroller-track"
          style={{ display: 'flex', gap: '20px', width: 'max-content', animation: 'blog-scroll 40s linear infinite' }}
        >
          {doubled.map((post, i) => (
            <Link
              key={`${post.slug}-${i}`}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: 'none', display: 'block', flexShrink: 0, width: '320px' }}
            >
              <article
                style={{
                  background: 'rgba(250,249,245,0.04)',
                  border: '1px solid rgba(250,249,245,0.08)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  height: '100%',
                  transition: 'background 0.2s, border-color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(250,249,245,0.07)'
                  el.style.borderColor = 'rgba(201,100,66,0.3)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(250,249,245,0.04)'
                  el.style.borderColor = 'rgba(250,249,245,0.08)'
                }}
              >
                {/* Tags row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c96442', background: 'rgba(201,100,66,0.12)', padding: '3px 9px', borderRadius: '999px', border: '1px solid rgba(201,100,66,0.2)' }}>
                    {post.category}
                  </span>
                  {post.region && (
                    <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(250,249,245,0.35)', background: 'rgba(250,249,245,0.06)', padding: '3px 9px', borderRadius: '999px', border: '1px solid rgba(250,249,245,0.1)' }}>
                      {post.region}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 400, color: '#faf9f5', lineHeight: 1.3, margin: '0 0 0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p style={{ fontSize: '13px', color: 'rgba(250,249,245,0.45)', lineHeight: 1.6, margin: '0 0 1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(250,249,245,0.25)', letterSpacing: '0.05em' }}>
                    {post.readingTime} min lezen
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c96442' }}>
                    Lees meer <ArrowRight size={10} />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blog-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .blog-scroller-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
