<script setup lang="ts">
//******VARIABLES/STATES*********
defineProps<{
  title: string;
  value: number | string;
  icon: string;
}>();
</script>

<template>
  <UCard class="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800">
    <UIcon :name="icon" class="text-2xl text-primary" />
    <div>
      <div class="text-md">{{ title }}</div>
      <div class="text-xl font-bold">{{ value }}</div>
    </div>
  </UCard>
</template>
