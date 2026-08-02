<script setup lang="ts">
//******HOOKS*********
const colorMode = useColorMode();

//******VARIABLES/STATES*********
const icon = computed(() =>
  colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'
);

//******FUNCTIONS*********
const toggle = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <UButton
    :icon="icon"
    class="text-zinc-800 dark:text-zinc-50 hover:bg-zinc-300 hover:dark:bg-zinc-700"
    variant="ghost"
    @click="toggle"
  />
</template>
