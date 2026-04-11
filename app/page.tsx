import { Nav } from '@/components/nav'
import { Hero } from '@/components/sections/hero'
import { Services } from '@/components/sections/services'
import { Tools } from '@/components/sections/tools'
import { About } from '@/components/sections/about'
import { Contact } from '@/components/sections/contact'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Tools />
        <About />
        <Contact />
      </main>
      <footer
        className="py-8 text-center text-xs"
        style={{ background: '#051209', color: 'rgba(250,249,245,0.3)' }}
      >
        © {new Date().getFullYear()} Lead it, Grow · leaditgrow.com · leaditgrow.be
      </footer>
    </>
  )
}
