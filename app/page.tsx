import { Nav } from '@/components/nav'
import { BgLogo } from '@/components/ui/bg-logo'
import { ScrollSpotlight } from '@/components/ui/scroll-spotlight'
import { Hero } from '@/components/sections/hero'
import { MarqueeBar } from '@/components/sections/marquee'
import { Services } from '@/components/sections/services'
import { StatsBar } from '@/components/sections/stats-bar'
import { Tools } from '@/components/sections/tools'
import { About } from '@/components/sections/about'
import { Contact } from '@/components/sections/contact'
import { BlogScroller } from '@/components/sections/blog-scroller'
import { ChatWidget } from '@/components/chat-widget'
import { FooterCta } from '@/components/footer-cta'

export default function Home() {
  return (
    <>
      <style>{`body { background: #f2f0eb; }`}</style>
      <BgLogo />
      <ScrollSpotlight />
      <Nav />
      <main>
        <Hero />
        <MarqueeBar />
        <Services />
        <StatsBar />
        <Tools />
        <About />
        <Contact />
        <BlogScroller />
      </main>
      <footer
        style={{
          background: '#0e0d0b',
          borderTop: '3px solid #0e0d0b',
          padding: '28px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono-brutalist, monospace)', fontSize: '13px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(242,240,235,.25)' }}>
          Lead it, Grow
        </span>
        <span style={{ fontFamily: 'var(--font-mono-brutalist, monospace)', fontSize: '12px', color: 'rgba(242,240,235,.18)', letterSpacing: '.06em' }}>
          © {new Date().getFullYear()} · leaditgrow.be · leaditgrow.com
        </span>
        <FooterCta />
      </footer>
      <ChatWidget />
    </>
  )
}
