<template>
  <div
    class="min-h-screen flex flex-col text-gray-900 dark:text-white bg-zinc-100 dark:bg-zinc-950"
  >
    <TheHeader />

    <main class="flex-1 relative">
      <UContainer class="py-10">
        <slot />
      </UContainer>
    </main>

    <TheFooter />
  </div>
</template>
