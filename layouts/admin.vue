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
              to="/dashboard"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >📊 Dashboard</ULink
            >
            <ULink
              to="/dashboard/employees"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >👥 Pracownicy</ULink
            >
            <ULink
              to="/dashboard/departments"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >🏢 Oddziały</ULink
            >
            <ULink
              to="/dashboard/attendance"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >📝 Obecności</ULink
            >
            <ULink
              to="/dashboard/cards"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >💳 Karty</ULink
            >

            <ULink
              to="/dashboard/readers"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >📟 Czytniki</ULink
            >
            <ULink
              to="/dashboard/employment"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >🧾 Etaty</ULink
            >
            <!-- <ULink
              to="/dashboard/leaves"
              active-class="text-primary font-semibold"
              >Urlopy</ULink
            > -->
            <ULink
              to="/dashboard/holidays"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >📅 Dni wolne</ULink
            >
            <ULink
              to="/dashboard/workday-adjustments"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >🛠️ Dostosowania dni pracy</ULink
            >
            <ULink
              to="/dashboard/serial-operations"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
              >👾 Operacje seryjne</ULink
            >
            <ULink
              to="/dashboard/invites"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
            >
              ✉️ Zaproszenia
            </ULink>
            <ULink
              to="/dashboard/attendance/daily"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
            >
              📈 Wszystkie odczyty
            </ULink>
            <ULink
              to="/dashboard/attendance/unregistered"
              active-class="text-primary font-semibold"
              @click="isSidebarOpen = false"
            >
              ❌ Odczyty nieprzypisanych kart
            </ULink>
          </nav>
        </div>
        <div class="flex-col space-x-2">
          <div class="flex flex-col lg:hidden gap-2 mb-6 items-center">
            <UButton
              class="text-center"
              to="/leaves/managment"
              color="success"
              variant="soft"
              block
              >Zarządzanie urlopami</UButton
            >
            <UButton
              class="text-center"
              to="/leaves/request"
              color="success"
              variant="soft"
              block
              >Wnioskowanie o urlop</UButton
            >
          </div>
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
        <div class="hidden lg:flex gap-2 items-center justify-between">
          <UButton
            class="text-center text-nowrap"
            to="/leaves/managment"
            color="success"
            variant="soft"
            block
            >Zarządzanie urlopami</UButton
          >
          <UButton
            class="text-center text-nowrap"
            to="/leaves/request"
            color="success"
            variant="soft"
            block
            >Wnioskowanie o urlop</UButton
          >
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
