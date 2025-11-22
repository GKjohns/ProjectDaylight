<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const isDev = process.dev

const inserting = ref(false)
const deleting = ref(false)
const lastInsert = ref<any | null>(null)
const lastDeleteCount = ref<number | null>(null)
const errorMessage = ref<string | null>(null)

const insertTestRow = async () => {
  errorMessage.value = null
  lastDeleteCount.value = null
  inserting.value = true

  try {
    const result = await $fetch('/api/dev-db-test', {
      method: 'POST'
    })

    lastInsert.value = result
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Dev DB test insert failed:', error)
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Failed to insert test row.'
  } finally {
    inserting.value = false
  }
}

const deleteTestRows = async () => {
  errorMessage.value = null
  deleting.value = true

  try {
    const result = await $fetch('/api/dev-db-test', {
      method: 'DELETE'
    }) as { deletedCount?: number }

    lastDeleteCount.value = result.deletedCount ?? 0
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Dev DB test delete failed:', error)
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Failed to delete test rows.'
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <UDashboardPanel id="dev-db-test">
    <template #header>
      <UDashboardNavbar title="Dev DB test">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="space-y-6">
        <UAlert
          v-if="!isDev"
          color="warning"
          variant="soft"
          title="Dev-only page"
          description="This page is intended for local development. Enable dev mode to use it."
        />

        <div v-else class="space-y-4">
          <UAlert
            color="info"
            variant="soft"
            title="Database connectivity test"
            description="This page inserts and deletes dummy rows in the public.patterns table using the Supabase service role."
          />

          <div class="flex flex-wrap gap-3">
            <UButton
              color="primary"
              :loading="inserting"
              @click="insertTestRow"
            >
              Insert dev test row
            </UButton>

            <UButton
              color="neutral"
              variant="outline"
              :loading="deleting"
              @click="deleteTestRows"
            >
              Delete dev test rows
            </UButton>
          </div>

          <UAlert
            v-if="errorMessage"
            color="error"
            variant="soft"
            title="Request failed"
            :description="errorMessage"
          />

          <div v-if="lastInsert" class="space-y-2">
            <h2 class="text-sm font-medium text-muted-foreground">
              Last insert result
            </h2>
            <pre class="rounded-md bg-muted p-3 text-xs">
{{ JSON.stringify(lastInsert, null, 2) }}
            </pre>
          </div>

          <div v-if="lastDeleteCount !== null" class="space-y-1 text-sm text-muted-foreground">
            <span>Deleted {{ lastDeleteCount }} dev test pattern row(s).</span>
          </div>

          <UAlert
            color="neutral"
            variant="subtle"
            title="Auth note"
            description="The API relies on X-Daylight-User-Id or DAYLIGHT_DEV_USER_ID to choose which user's rows to touch."
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>


