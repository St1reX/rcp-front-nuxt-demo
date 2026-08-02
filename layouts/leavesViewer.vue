<script setup lang="ts">
//******VARIABLES/STATES*********
const toast = useToast();
const api = useApi();
const sessionStorage = useSessionStore();
const isSidebarOpen = ref(false);

//******FUNCTIONS*********
const logout = async () => {
  await api.auth.logout();
  sessionStorage.session = null;
  toast.add({ title: 'Wylogowano', color: 'neutral' });
  window.location.reload();
};
</script>

<template>
  <div
    class="flex h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950 text-gray-900 dark:text-white"
  >
    <!-- Sidebar (mobile overlay + desktop fixed) -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-70 transform bg-zinc-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 transition-transform duration-200 ease-in-out',
        { '-translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen },
        'lg:translate-x-0 lg:static lg:inset-0',
      ]"
    >
      <div class="h-full flex flex-col justify-between px-4 py-6">
        <div>
          <h2 class="text-xl font-bold mb-6">🕒 RCP</h2>
          <nav class="space-y-2 flex flex-col">
            <ULink
              to="/leaves/view"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >📅 Kalendarz urlopów</ULink
            >
            <ULink
              to="/leaves/view/requests"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >📄 Wnioski o urlop</ULink
            >
          </nav>
        </div>
        <div class="flex-col space-x-2">
          <div class="flex">
            <ColorToggle />
            <UButton
              class="text-center"
              color="error"
              variant="soft"
              block
              @click="logout"
              >Wyloguj się</UButton
            >
          </div>
        </div>
      </div>
    </aside>

    <!-- Overlay (mobile only) -->
    <div
      v-if="isSidebarOpen"
      class="sticky inset-0 z-30 bg-black bg-opacity-40 lg:hidden"
      @click="isSidebarOpen = false"
    />

    <!-- Main content -->
    <div class="flex-1 flex h-screen overflow-hidden flex-col">
      <!-- Topbar -->
      <header
        class="shrink-0 flex sticky top-0 z-20 items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
      >
        <div class="lg:hidden">
          <UButton
            icon="i-heroicons-bars-3"
            size="sm"
            variant="ghost"
            @click="isSidebarOpen = !isSidebarOpen"
          />
        </div>
        <h1 class="text-lg font-medium">Panel administratora</h1>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
