import { getSupabaseClient, getRequestUserId } from '../utils/supabaseClient'

export default defineEventHandler(async (event) => {
  const supabase = await getSupabaseClient(event)
  const userId = await getRequestUserId(event)

  const now = Date.now()
  const key = `dev_test_${now}`

  const { data, error } = await supabase
    .from('patterns')
    .insert({
      user_id: userId,
      key,
      label: 'Dev DB connectivity test'
    })
    .select('id, user_id, key, label, created_at')
    .single()

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Dev DB test insert error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to insert dev test pattern row.'
    })
  }

  return {
    message: 'Inserted dev test pattern row.',
    row: data
  }
})
