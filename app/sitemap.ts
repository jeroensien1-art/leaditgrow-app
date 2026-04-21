import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { posts } from '@/lib/blog/posts'
import { postsEn } from '@/lib/blog/posts-en'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const isEn = host.includes('leaditgrow.com')

  const BASE_URL = isEn ? 'https://leaditgrow.com' : 'https://leaditgrow.be'
  const activePosts = isEn ? postsEn : posts

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date('2026-04-21'), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/diagnostic`, lastModified: new Date('2026-04-15'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/calculator`, lastModified: new Date('2026-04-15'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date('2026-04-21'), changeFrequency: 'weekly', priority: 0.8 },
    ...(!isEn ? [
      { url: `${BASE_URL}/diensten`, lastModified: new Date('2026-04-15'), changeFrequency: 'monthly' as const, priority: 0.9 },
      { url: `${BASE_URL}/actiehandboek`, lastModified: new Date('2026-04-15'), changeFrequency: 'monthly' as const, priority: 0.8 },
    ] : []),
  ]

  const blogRoutes: MetadataRoute.Sitemap = activePosts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}
