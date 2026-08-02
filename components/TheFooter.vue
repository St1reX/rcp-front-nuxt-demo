<template>
  <footer>
    <WaveDivider
      class="text-zinc-50 dark:text-zinc-800"
      v-if="$route.name === 'index'"
    />
    <div class="bg-zinc-50 dark:bg-zinc-800 dark:border-gray-800">
      <UContainer
        class="py-6 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        Made and maintained by
        <a href="https://github.com/St1reX" target="_blank">Jakub Uryga</a> | &copy;
        {{ new Date().getFullYear() }} RCP System – Wszystkie prawa zastrzeżone.
      </UContainer>
    </div>
  </footer>
</template>
