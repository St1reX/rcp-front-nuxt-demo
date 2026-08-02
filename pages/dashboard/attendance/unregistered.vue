<script setup lang="ts">
import type { BreadcrumbItem, TableColumn } from '#ui/types';
import { FetchError } from 'ofetch';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
type UnregisteredRead = {
  cardKey: string;
  readerId: string;
  timestamp: number;
  reason: string;
};
const api = useApi();
const toast = useToast();
const isLoading = ref<boolean>(true);
const unregisteredReads = ref<any[]>([]);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Odczyty niezapisanych kart',
    to: '/dashboard/attendance/unregistered',
  },
];

//******DATA TABLE*********
const columns: TableColumn<UnregisteredRead>[] = [
  {
    accessorKey: 'cardKey',
    header: 'Klucz karty',
    cell: ({ row }) => row.getValue('cardKey'),
  },
  {
    accessorKey: 'readerId',
    header: 'ID czytnika',
    cell: ({ row }) => {
      const readerId = row.getValue('readerId');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/readers/${readerId}`,
          class: 'underline text-primary',
        },
        () => `${readerId}`
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: 'Czas odczytu',
    cell: ({ row }) => {
      const timestamp: number = row.getValue('timestamp');
      return `${new Date(timestamp).toLocaleString('pl-PL')}`;
    },
  },
  {
    accessorKey: 'reason',
    header: 'Powód',
    cell: ({ row }) =>
      row.getValue('reason') === 'CARD_NOT_FOUND'
        ? 'Nie znaleziono karty w systemie'
        : 'Karta nie przypisana do żadnego pracownika',
  },
];

//******FUNCTIONS*********
const loadReads = async () => {
  isLoading.value = true;
  try {
    unregisteredReads.value = await api.attendance.getUnregisteredCardReads();
  } catch (e: any) {
    useFetchErrorHandler('Odczyty kart nieprzypisanych', e);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await loadReads();
});
</script>

<template>
  <div class="space-y-6" v-if="!isLoading">
    <UBreadcrumb :items="breadcrumbItems">
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>

    <div class="flex justify-between">
      <h1 class="text-2xl font-bold">Odczyty niezapisanych kart (Ostatnie 24h)</h1>
    </div>

    <div class="flex flex-col space-y-8 flex-1 w-full">
      <UCard class="bg-zinc-100 dark:bg-zinc-800">
        <UTable
          :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
          :data="unregisteredReads"
          :columns
        />
      </UCard>
    </div>
  </div>
</template>
