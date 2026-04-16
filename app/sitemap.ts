import type { MetadataRoute } from 'next'
import { posts } from '@/lib/blog/posts'

const BASE_URL = 'https://leaditgrow.be'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/diensten`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/diagnostic`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/calculator`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/actiehandboek`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date('2026-04-15'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const blogRoutes: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}
