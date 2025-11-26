import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

interface ExportCreateBody {
  title: string
  markdown_content: string
  focus: 'full-timeline' | 'incidents-only' | 'positive-parenting'
  metadata?: {
    case_title?: string
    court_name?: string
    recipient?: string
    overview_notes?: string
    include_evidence_index?: boolean
    include_overview?: boolean
    include_ai_summary?: boolean
    events_count?: number
    evidence_count?: number
    ai_summary_included?: boolean
  }
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

  const body = await readBody<ExportCreateBody>(event)

  if (!body?.title?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title is required'
    })
  }

  if (!body?.markdown_content?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Markdown content is required'
    })
  }

  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase
    .from('exports')
    .insert({
      user_id: userId,
      title: body.title.trim(),
      markdown_content: body.markdown_content,
      focus: body.focus || 'full-timeline',
      metadata: body.metadata || {}
    })
    .select()
    .single()

  if (error) {
    console.error('[Exports] Failed to create export:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save export'
    })
  }

  return { export: data }
})


