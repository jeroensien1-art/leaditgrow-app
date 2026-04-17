import { headers } from 'next/headers'

export async function getLang(): Promise<'nl' | 'en'> {
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie') || ''
  const langCookie = cookieHeader
    .split('; ')
    .find((row) => row.startsWith('lang='))
    ?.split('=')[1]
  return (langCookie === 'en' ? 'en' : 'nl') as 'nl' | 'en'
}
