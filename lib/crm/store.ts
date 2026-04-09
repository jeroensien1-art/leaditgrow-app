import Redis from 'ioredis'
import type { Lead } from './claude'

const redis = new Redis(process.env.REDIS_URL!)

const PREFIX = 'lead:'
const FOLLOWUP_SET = 'followup_queue'
const TWO_HOURS = 2 * 60 * 60 * 1000

export async function saveLead(lead: Lead): Promise<void> {
  await redis.set(`${PREFIX}${lead.id}`, JSON.stringify(lead))
  const followUpAt = lead.submittedAt + TWO_HOURS
  await redis.zadd(FOLLOWUP_SET, followUpAt, lead.id)
}

export async function getLead(id: string): Promise<Lead | null> {
  const raw = await redis.get(`${PREFIX}${id}`)
  if (!raw) return null
  return JSON.parse(raw) as Lead
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<void> {
  const lead = await getLead(id)
  if (!lead) return
  await redis.set(`${PREFIX}${id}`, JSON.stringify({ ...lead, ...patch }))
}

export async function markReplied(id: string): Promise<void> {
  await updateLead(id, { status: 'replied', repliedAt: Date.now() })
  await redis.zrem(FOLLOWUP_SET, id)
}

export async function getDueFollowUps(): Promise<Lead[]> {
  const now = Date.now()
  const ids = await redis.zrangebyscore(FOLLOWUP_SET, 0, now)
  if (!ids.length) return []

  const leads = await Promise.all(ids.map(id => getLead(id)))
  return leads.filter((l): l is Lead =>
    l !== null &&
    l.status !== 'replied' &&
    !l.followedUpAt
  )
}

export async function markFollowedUp(id: string): Promise<void> {
  await updateLead(id, { status: 'followed_up', followedUpAt: Date.now() })
  await redis.zrem(FOLLOWUP_SET, id)
}
