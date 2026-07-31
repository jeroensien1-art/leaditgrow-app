import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

/**
 * Zet een adres in de e-maillijst en voegt de tag toe.
 * Bestaat het adres al, dan komt de tag erbij zonder de bestaande tags te wissen
 * en zonder een tweede rij aan te maken.
 */
export async function addToEmailList(opts: {
  email: string
  name?: string
  tag: string
  source?: string
  lang?: 'nl' | 'en'
}): Promise<void> {
  const email = opts.email.trim().toLowerCase()

  const { data: bestaand } = await supabase
    .from('email_list')
    .select('id, tags, name')
    .eq('email', email)
    .maybeSingle()

  if (bestaand) {
    const tags: string[] = Array.isArray(bestaand.tags) ? bestaand.tags : []
    if (tags.includes(opts.tag)) return
    const { error } = await supabase
      .from('email_list')
      .update({
        tags: [...tags, opts.tag],
        name: bestaand.name ?? opts.name ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bestaand.id)
    if (error) throw new Error(`addToEmailList update: ${error.message}`)
    return
  }

  const { error } = await supabase.from('email_list').insert({
    email,
    name: opts.name ?? null,
    tags: [opts.tag],
    source: opts.source ?? 'freebie',
    lang: opts.lang ?? 'nl',
  })
  // race met een gelijktijdige opt-in van hetzelfde adres: dan bestaat de rij al
  if (error && !error.message.includes('duplicate key')) {
    throw new Error(`addToEmailList insert: ${error.message}`)
  }
  if (error) await addToEmailList(opts)
}
