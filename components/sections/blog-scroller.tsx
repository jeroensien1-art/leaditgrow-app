'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getLocalizedPosts } from '@/lib/blog'
import { useLang } from '@/components/lang-context'

const B    = 'var(--font-brutalist, system-ui)'
const D    = 'var(--font-display, var(--font-brutalist, system-ui))'
const M    = 'var(--font-mono-brutalist, monospace)'
const INK  = '#0e0d0b'
const BG   = '#f2f0eb'
const LIME = '#4ade80'
const ORNG = '#c96442'

const css = `
  .b-bl { background: ${INK}; border-top: 3px solid ${INK}; padding: 88px 0 72px;
          overflow: hidden; position: relative; z-index: 1; }
  .b-bl-head { max-width: 1180px; margin: 0 auto; padding: 0 40px 48px; display: flex;
               align-items: flex-end; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
  .b-bl-kicker { font-family: ${M}; font-size: 12px; font-weight: 700; letter-spacing: .2em;
                 text-transform: uppercase; color: ${ORNG}; margin-bottom: 18px; }
  .b-bl-head h2 { font-family: ${D}; font-weight: 700; font-size: clamp(30px, 4.4vw, 62px);
                  line-height: .96; letter-spacing: -.018em; text-transform: uppercase;
                  color: ${BG}; margin: 0; max-width: 16ch; }
  .b-bl-head h2 span { color: ${LIME}; }
  .b-bl-all { font-family: ${B}; font-size: 13px; font-weight: 700; letter-spacing: .1em;
              text-transform: uppercase; color: ${BG}; text-decoration: none; white-space: nowrap;
              border: 2px solid ${BG}; padding: 15px 24px; display: inline-flex; align-items: center;
              gap: 9px; transition: background .15s, color .15s; }
  .b-bl-all:hover { background: ${BG}; color: ${INK}; }

  .b-bl-fade { position: absolute; top: 0; bottom: 0; width: 90px; z-index: 2; pointer-events: none; }
  .b-bl-fade.l { left: 0; background: linear-gradient(to right, ${INK}, transparent); }
  .b-bl-fade.r { right: 0; background: linear-gradient(to left, ${INK}, transparent); }

  .b-bl-track { display: flex; gap: 0; width: max-content; animation: b-bl-scroll 90s linear infinite; }
  .b-bl-track:hover { animation-play-state: paused; }
  @keyframes b-bl-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  .b-bl-card { flex-shrink: 0; width: 340px; text-decoration: none; display: block;
               border: 2px solid rgba(242,240,235,.22); margin-right: -2px;
               padding: 28px 26px; transition: background .18s, border-color .18s; }
  .b-bl-card:hover { background: rgba(242,240,235,.06); border-color: ${LIME}; }
  .b-bl-tags { display: flex; align-items: center; gap: 0; margin-bottom: 22px; flex-wrap: wrap; }
  .b-bl-tag { font-family: ${M}; font-size: 11px; font-weight: 700; letter-spacing: .14em;
              text-transform: uppercase; color: ${INK}; background: ${LIME}; padding: 5px 10px; }
  .b-bl-tag.alt { background: transparent; color: rgba(242,240,235,.45);
                  border: 1px solid rgba(242,240,235,.2); margin-left: 6px; }
  .b-bl-card h3 { font-family: ${D}; font-weight: 700; font-size: 21px; line-height: 1.08;
                  letter-spacing: -.012em; text-transform: uppercase; color: ${BG};
                  margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 3;
                  -webkit-box-orient: vertical; overflow: hidden; }
  .b-bl-card p { font-family: ${B}; font-size: 15px; line-height: 1.6; color: rgba(242,240,235,.5);
                 margin: 0 0 24px; display: -webkit-box; -webkit-line-clamp: 2;
                 -webkit-box-orient: vertical; overflow: hidden; }
  .b-bl-foot { display: flex; align-items: center; justify-content: space-between;
               border-top: 1px solid rgba(242,240,235,.15); padding-top: 14px; }
  .b-bl-foot span { font-family: ${M}; font-size: 11px; letter-spacing: .1em;
                    text-transform: uppercase; color: rgba(242,240,235,.3); }
  .b-bl-foot b { font-family: ${M}; font-size: 11px; font-weight: 700; letter-spacing: .12em;
                 text-transform: uppercase; color: ${LIME}; display: flex; align-items: center; gap: 5px; }

  @media (max-width: 900px) {
    .b-bl { padding: 56px 0 48px; }
    .b-bl-head { padding: 0 20px 32px; }
    .b-bl-card { width: 280px; padding: 22px 20px; }
    .b-bl-fade { width: 40px; }
  }
`

export function BlogScroller() {
  const { t, lang } = useLang()
  const posts = getLocalizedPosts(lang)
  const doubled = [...posts, ...posts]

  return (
    <section className="b-bl">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="b-bl-head">
        <div>
          <div className="b-bl-kicker">{t('Van de blog', 'From the blog')}</div>
          <h2>
            {t('Inzichten voor', 'Insights for')}<br />
            <span>{t('zaakvoerders', 'business owners')}</span><br />
            {t('die willen groeien', 'who want to grow')}
          </h2>
        </div>
        <Link href="/blog" className="b-bl-all">
          {t('Alle artikels', 'All articles')} <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ position: 'relative' }}>
        <div className="b-bl-fade l" />
        <div className="b-bl-fade r" />

        <div className="b-bl-track">
          {doubled.map((post, i) => (
            <Link key={`${post.slug}-${i}`} href={`/blog/${post.slug}`} className="b-bl-card">
              <div className="b-bl-tags">
                <span className="b-bl-tag">{post.category}</span>
                {post.region && <span className="b-bl-tag alt">{post.region}</span>}
              </div>

              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>

              <div className="b-bl-foot">
                <span>{post.readingTime} {t('min lezen', 'min read')}</span>
                <b>{t('Lees meer', 'Read more')} <ArrowRight size={11} /></b>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
