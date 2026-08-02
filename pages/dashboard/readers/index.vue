<script setup lang="ts">
import type { TableColumn, BreadcrumbItem } from '#ui/types';

//******META*********
definePageMeta({ layout: 'admin' });

//******VARIABLES/STATES*********
type Reader = {
  id: string;
  name: string;
  type: string;
  readerIp: string | null;
  metadata?: Record<string, any>;
  createdAt: Date;
};
const api = useApi();
const readers = ref<any[]>([]);
const total = ref<number>(0);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Czytniki',
    to: '/dashboard/readers',
  },
];

//******DATA TABLE*********
const columns: TableColumn<Reader>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const readerId = row.getValue('id');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/readers/${readerId}`,
          class: 'text-primary underline',
        },
        () => `#${readerId}`
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Nazwa',
    cell: ({ row }) => {
      const readerId = row.getValue('id');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/readers/${readerId}`,
          class: 'text-primary underline',
        },
        () => `${row.getValue('name')}`
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Typ',
    cell: ({ row }) => {
      const type = row.getValue('type');
      return type === 'ENTRY'
        ? 'WEJŚCIOWY'
        : type === 'EXIT'
        ? 'WYJŚCIOWY'
        : 'OBUSTRONNY';
    },
  },
  {
    accessorKey: 'readerIp',
    header: 'Adres IP',
    cell: ({ row }) => row.getValue('readerIp') || '-',
  },
  {
    accessorKey: 'createdAt',
    header: 'Utworzony',
    cell: ({ row }) => {
      const createdAt: Date = new Date(row.getValue('createdAt'));
      return (
        createdAt.toLocaleDateString('pl-PL') +
        ' ' +
        createdAt.toLocaleTimeString('pl-PL')
      );
    },
  },
];

//******FUNCTIONS*********
const fetchReaders = async () => {
  try {
    const result = await api.cardReader.list({ });
    readers.value = result.readers;
    total.value = result.count;
  } catch (e: any) {
    useFetchErrorHandler('Czytnik', e);
  }
};
onMounted(async () => {
  await fetchReaders();
});
</script>

<template>
  <div class="space-y-6">
    <UBreadcrumb :items="breadcrumbItems">
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold">Czytniki</h1>
      <UButton
        icon="i-lucide-gamepad"
        to="/dashboard/readers/create"
        label="Dodaj nowy czytnik"
      />
    </div>
    <div class="flex flex-col space-y-8 flex-1 w-full">
      <UCard class="bg-zinc-100 dark:bg-zinc-800">
        <UTable
          :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
          :columns
          :data="readers"
        />
      </UCard>
    </div>
  </div>
</template>
