<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';

</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="neutral" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
  <Analytics />
</template>
