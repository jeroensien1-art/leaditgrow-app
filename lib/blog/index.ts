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
  return posts.map(p => p.slug)
}
