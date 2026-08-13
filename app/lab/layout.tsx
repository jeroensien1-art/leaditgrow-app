import type { Metadata } from 'next'

// Testpagina's. Nooit indexeren, dit is geen publieke inhoud.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
