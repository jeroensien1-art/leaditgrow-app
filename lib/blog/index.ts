import { posts } from './posts'
import { postsEn } from './posts-en'
import type { BlogPost } from './posts'

export type { BlogPost }

export function getLocalizedPosts(lang: 'nl' | 'en'): BlogPost[] {
  return lang === 'en' ? postsEn : posts
}

export function getLocalizedPost(slug: string, lang: 'nl' | 'en'): BlogPost | undefined {
  return getLocalizedPosts(lang).find(p => p.slug === slug)
}

export function getAllSlugs(): string[] {
  const nlSlugs = posts.map(p => p.slug)
  const enSlugs = postsEn.map(p => p.slug)
  return Array.from(new Set([...nlSlugs, ...enSlugs]))
}
