import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/login', '/logo-preview', '/api/'],
      },
    ],
    sitemap: 'https://leaditgrow.be/sitemap.xml',
  }
}
