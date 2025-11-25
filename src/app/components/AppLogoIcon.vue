<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Sky blue rounded square with perfectly circular bite -->
    <path
      d="M68 20
         L380 20
         Q400 20 400 68
         L400 332
         Q400 380 332 380
         L68 380
         Q20 380 20 332
         L20 180
         A160 160 0 0 0 180 20
         Z"
      class="fill-sky-500 dark:fill-sky-400"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
}>(), {
  size: 40
})
</script>

