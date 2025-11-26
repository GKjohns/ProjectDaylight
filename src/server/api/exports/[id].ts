import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

interface ExportUpdateBody {
  title?: string
  markdown_content?: string
  focus?: 'full-timeline' | 'incidents-only' | 'positive-parenting'
  metadata?: Record<string, any>
}

export default defineEventHandler(async (event) => {
  // Auth check
  const user = await serverSupabaseUser(event)
  const userId = user?.sub || user?.id

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Please log in'
    })
  }

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Export ID is required'
    })
  }

  const supabase = await serverSupabaseClient(event)
  const method = event.method

  // GET - Fetch single export
  if (method === 'GET') {
    const { data, error } = await supabase
      .from('exports')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Export not found'
      })
    }

    return { export: data }
  }

  // PATCH - Update export
  if (method === 'PATCH') {
    const body = await readBody<ExportUpdateBody>(event)

    if (!body || Object.keys(body).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No update data provided'
      })
    }

    // Build update object with only provided fields
    const updateData: Record<string, any> = {}
    
    if (body.title !== undefined) {
      updateData.title = body.title.trim()
    }
    if (body.markdown_content !== undefined) {
      updateData.markdown_content = body.markdown_content
    }
    if (body.focus !== undefined) {
      updateData.focus = body.focus
    }
    if (body.metadata !== undefined) {
      updateData.metadata = body.metadata
    }

    const { data, error } = await supabase
      .from('exports')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('[Exports] Failed to update export:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update export'
      })
    }

    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Export not found'
      })
    }

    return { export: data }
  }

  // DELETE - Remove export
  if (method === 'DELETE') {
    const { error, count } = await supabase
      .from('exports')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('[Exports] Failed to delete export:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete export'
      })
    }

    return { success: true }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})


