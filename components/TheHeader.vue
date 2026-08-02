<script setup lang="ts">
import { Roles } from '~/constants/roles';

//******HOOKS*********
const api = useApi();
const toast = useToast();
const sessionStore = useSessionStore();

//******FUNCTIONS*********
const logout = async () => {
  await api.auth.logout();
  sessionStorage.session = null;
  toast.add({ title: 'Wylogowano', color: 'neutral' });
  window.location.reload();
};
</script>

<template>
  <header
    class="bg-zinc-50 dark:bg-zinc-800 backdrop-blur border-b border-gray-200 dark:border-gray-800"
  >
    <UContainer class="py-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">🕒 RCP System</h1>

      <div class="flex gap-3">
        <ColorToggle />
        <UButton
          v-if="sessionStore.isInRole(Roles.ADMIN)"
          label="Panel"
          color="primary"
          variant="soft"
          to="/dashboard"
        />
        <UButton
          v-if="!sessionStore.isAuthenticated"
          label="Zaloguj się"
          color="primary"
          variant="ghost"
          to="/login"
        />
        <UButton
          v-if="sessionStore.isAuthenticated"
          label="Wyloguj się"
          color="primary"
          variant="ghost"
          @click="logout"
        />
      </div>
    </UContainer>
  </header>
</template>
