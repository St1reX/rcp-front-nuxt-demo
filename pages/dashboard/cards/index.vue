<script setup lang="ts">
import type { TableColumn, BreadcrumbItem } from '@nuxt/ui/';

//******META*********
definePageMeta({ layout: 'admin' });

//******VARIABLES/STATES*********
type Card = {
  id: string;
  key: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};
const api = useApi();
const cards = ref<any[]>([]);
const isLoading = ref(false);
const page = ref<number>(1);
const total = ref<number>(0);
const limit = ref<number>(100);
const orderBy = ref<string | undefined>();
const orderBySorting = ref<string | undefined>();
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Karty',
    to: '/dashboard/cards',
  },
];

//******DATA TABLE*********
const columns: TableColumn<Card>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const cardId = row.getValue('id');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/cards/${cardId}`,
          class: 'text-primary underline',
        },
        () => `#${cardId}`
      );
    },
  },
  {
    accessorKey: 'key',
    header: 'Klucz',
    cell: ({ row }) => {
      const cardId = row.getValue('id');
      const key = row.getValue('key');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/cards/${cardId}`,
          class: 'text-primary underline',
        },
        () => `${key}`
      );
    },
  },
  {
    accessorKey: 'employee',
    header: 'Pracownik',
    cell: ({ row }) => {
      const employee: any = row.getValue('employee');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/employees/${employee.id}`,
          class: 'text-primary underline',
        },
        () => `${employee.firstName} ${employee.lastName}`
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Utworzono',
    cell: ({ row }) => {
      const createdAt: Date = new Date(row.getValue('createdAt'));
      return (
        createdAt.toLocaleDateString('pl-PL') +
        ' ' +
        createdAt.toLocaleTimeString('pl-PL')
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Zmodyfikowano',
    cell: ({ row }) => {
      const updatedAt: Date = new Date(row.getValue('updatedAt'));
      return (
        updatedAt.toLocaleDateString('pl-PL') +
        ' ' +
        updatedAt.toLocaleTimeString('pl-PL')
      );
    },
  },
];

//******FUNCTIONS*********
const fetchCards = async () => {
  isLoading.value = true;
  try {
    const response = await api.card.getAllCards({
      limit: limit.value,
      offset: (page.value - 1) * limit.value,
      orderBy: orderBy.value,
      sort: orderBySorting.value,
    });
    cards.value = response.cards;
    total.value = response.count;
    isLoading.value = false;
  } catch (e: any) {
    useFetchErrorHandler('Karta pracownicza', e);
  }
};
onMounted(async () => {
  await fetchCards();
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
      <h1 class="text-2xl font-bold">Karty</h1>
    </div>

    <div class="flex flex-col space-y-8 flex-1 w-full">
      <UCard class="bg-zinc-100 dark:bg-zinc-800">
        <UTable
          :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
          :columns
          :data="cards"
        />
      </UCard>

      <div class="pt-5 w-full flex items-center justify-center">
        <UPagination v-model:page="page" :total="total" :items-per-page="limit" />
      </div>

      <div class="space-y-2">
        <h2 class="text-lg font-bold">Rekordów na stronie</h2>
        <USelect :items="[50, 100, 150, 200]" v-model="limit" />
      </div>
    </div>
  </div>
</template>
