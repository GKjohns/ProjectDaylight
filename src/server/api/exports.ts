import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default eventHandler(async (event) => {
  // Protect exports behind authenticated sessions (cookie/JWT based)
  const user = await serverSupabaseUser(event)
  const userId = user?.sub || user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please log in'
    })
  }

  const supabase = serverSupabaseServiceRole(event)

  const { data: exports, error } = await supabase
    .from('exports')
    .select('id, title, focus, metadata, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Exports] Failed to fetch exports:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch exports'
    })
  }

  return {
    exports: exports || []
  }
})


