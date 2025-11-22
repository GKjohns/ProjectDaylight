import { getSupabaseClient, getRequestUserId } from '../utils/supabaseClient'

export default defineEventHandler(async (event) => {
  const supabase = await getSupabaseClient(event)
  const userId = await getRequestUserId(event)

  const { error, count } = await supabase
    .from('patterns')
    .delete({ count: 'exact' })
    .eq('user_id', userId)
    .like('key', 'dev_test_%')

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Dev DB test delete error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete dev test pattern rows.'
    })
  }

  return {
    message: 'Deleted dev test pattern rows.',
    deletedCount: count ?? 0
  }
})
