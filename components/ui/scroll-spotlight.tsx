'use client'

import { useEffect } from 'react'

export function ScrollSpotlight() {
  useEffect(() => {
    const spots = Array.from(document.querySelectorAll('[data-spot]'))
    const ratioMap = new WeakMap<Element, number>()

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => ratioMap.set(e.target, e.intersectionRatio))

        let best: Element | null = null
        let bestRatio = 0
        spots.forEach(el => {
          const r = ratioMap.get(el) ?? 0
          if (r > bestRatio) { bestRatio = r; best = el }
        })

        spots.forEach(el => {
          if (el === best && bestRatio > 0.08) {
            el.classList.add('in-view')
          } else {
            el.classList.remove('in-view')
          }
        })
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i * 0.05) },
    )

    spots.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
