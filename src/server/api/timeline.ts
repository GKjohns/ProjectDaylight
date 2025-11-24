import type { TimelineEvent } from '~/types'
import type { Tables } from '~/types/database.types'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

type EventRow = Tables<'events'>
type EventParticipantRow = Tables<'event_participants'>
type EventEvidenceRow = Tables<'event_evidence'>

function mapEventToTimelineEvent(
  row: EventRow,
  participants: string[],
  evidenceIds: string[]
): TimelineEvent {
  return {
    id: row.id,
    timestamp: (row.primary_timestamp as string | null) ?? (row.created_at as string),
    type: row.type as TimelineEvent['type'],
    title: row.title,
    description: row.description,
    participants: participants.length ? participants : ['You'],
    location: row.location ?? undefined,
    evidenceIds: evidenceIds.length ? evidenceIds : undefined
  }
}

export default eventHandler(async (event) => {
  const supabase = await serverSupabaseServiceRole(event)

  // Resolve the authenticated user from the Supabase access token (Authorization header)
  // and fall back to cookie-based auth via serverSupabaseUser.
  let userId: string | null = null

  const authHeader = getHeader(event, 'authorization') || getHeader(event, 'Authorization')
  const bearerPrefix = 'Bearer '
  const token = authHeader?.startsWith(bearerPrefix)
    ? authHeader.slice(bearerPrefix.length).trim()
    : undefined

  if (token) {
    const { data: userResult, error: userError } = await supabase.auth.getUser(token)

    if (userError) {
      // eslint-disable-next-line no-console
      console.error('Supabase auth.getUser error (timeline):', userError)
    } else {
      userId = userResult.user?.id ?? null
    }
  }

  if (!userId) {
    const authUser = await serverSupabaseUser(event)
    userId = authUser?.id ?? null
  }

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage:
        'User is not authenticated. Please sign in through Supabase and include the session token in the request.'
    })
  }

  const {
    data: eventsRows,
    error: eventsError
  } = await supabase
    .from('events')
    .select(
      'id, type, title, description, primary_timestamp, location, created_at'
    )
    .eq('user_id', userId)
    .order('primary_timestamp', { ascending: false, nullsFirst: false })
    .limit(100)

  if (eventsError) {
    // eslint-disable-next-line no-console
    console.error('Supabase select events error (timeline):', eventsError)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load timeline events.'
    })
  }

  const events = (eventsRows ?? []) as EventRow[]

  if (!events.length) {
    return []
  }

  const eventIds = events.map((e) => e.id)

  const [
    { data: participantsRows, error: participantsError },
    { data: eventEvidenceRows, error: eventEvidenceError }
  ] = await Promise.all([
    supabase
      .from('event_participants')
      .select('event_id, label')
      .in('event_id', eventIds),
    supabase
      .from('event_evidence')
      .select('event_id, evidence_id')
      .in('event_id', eventIds)
  ])

  if (participantsError) {
    // eslint-disable-next-line no-console
    console.error('Supabase select event_participants error (timeline):', participantsError)
  }

  if (eventEvidenceError) {
    // eslint-disable-next-line no-console
    console.error('Supabase select event_evidence error (timeline):', eventEvidenceError)
  }

  const participantsByEvent = new Map<string, string[]>()
  const evidenceIdsByEvent = new Map<string, string[]>()

  for (const row of (participantsRows ?? []) as EventParticipantRow[]) {
    const list = participantsByEvent.get(row.event_id) ?? []
    list.push(row.label)
    participantsByEvent.set(row.event_id, list)
  }

  for (const row of (eventEvidenceRows ?? []) as EventEvidenceRow[]) {
    const list = evidenceIdsByEvent.get(row.event_id) ?? []
    list.push(row.evidence_id)
    evidenceIdsByEvent.set(row.event_id, list)
  }

  return events.map((row) =>
    mapEventToTimelineEvent(
      row,
      participantsByEvent.get(row.id) ?? [],
      evidenceIdsByEvent.get(row.id) ?? []
    )
  )
})


