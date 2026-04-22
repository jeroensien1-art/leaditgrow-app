import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const isEn = host.includes('leaditgrow.com')
  const base = isEn ? 'https://leaditgrow.com' : 'https://leaditgrow.be'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/login', '/logo-preview', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
