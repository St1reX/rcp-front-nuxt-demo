<script setup lang="ts">
import type { TableColumn, BreadcrumbItem } from '#ui/types';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
type Adjustment = {
  id: string;
  date: Date;
  time: string;
  type: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
};
const api = useApi();
const workdayAdjustments = ref<any[]>([]);
const isLoading = ref(true);
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
    label: 'Dostosowania czasu pracy',
    to: '/dashboard/workday-adjustments',
  },
];

//******DATA TABLE*********
const columns: TableColumn<Adjustment>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/workday-adjustments/${id}`,
          class: 'text-primary underline',
        },
        () => `#${id}`
      );
    },
  },
  {
    accessorKey: 'reason',
    header: 'Powód',
    cell: ({ row }) => row.getValue('reason'),
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      const date: Date = new Date(row.getValue('date'));
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: 'time',
    header: 'Godzina',
    cell: ({ row }) => row.getValue('time'),
  },
  {
    accessorKey: 'type',
    header: 'Typ',
    cell: ({ row }) => {
      const type = row.getValue('type');
      return type === 'LATE_START'
        ? 'Późniejsze rozpoczęcie pracy'
        : 'Wcześniejsze zakończenie pracy';
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Utworzono',
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue('createdAt'));
      return createdAt.toLocaleDateString() + ' ' + createdAt.toLocaleTimeString();
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Zaktualizowano',
    cell: ({ row }) => {
      const updatedAt = new Date(row.getValue('updatedAt'));
      return updatedAt.toLocaleDateString() + ' ' + updatedAt.toLocaleTimeString();
    },
  },
];

//******FUNCTIONS*********
const fetchWorkdayAdjustments = async () => {
  isLoading.value = true;
  try {
    const response = await api.workdayAdjustment.getAll({
      limit: limit.value,
      offset: (page.value - 1) * limit.value,
      orderBy: orderBy.value,
      sort: orderBySorting.value,
    });

    workdayAdjustments.value = response.adjustments || [];
    total.value = Math.ceil(response.count / limit.value);
  } catch (e: any) {
    useFetchErrorHandler('Dostosowanie godzin pracy', e);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await fetchWorkdayAdjustments();
});
</script>

<template>
  <div class="space-y-8">
    <UBreadcrumb :items="breadcrumbItems">
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold">Dostosowania dnia pracy</h1>
      <UButton
        icon="i-lucide-hammer"
        label="Dodaj dostosowanie"
        to="/dashboard/workday-adjustments/create"
      />
    </div>

    <div
      class="flex flex-col space-y-8 flex-1 w-full"
      v-if="workdayAdjustments.length"
    >
      <UCard class="bg-zinc-100 dark:bg-zinc-800">
        <UTable
          :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
          :data="workdayAdjustments"
          :columns
        />
      </UCard>
      <div class="pt-5 w-full flex items-center justify-center">
        <UPagination v-model:page="page" :total="total" :items-per-page="limit" />
      </div>
    </div>
    <div v-else>Brak dostosowań dnia pracy</div>
  </div>
</template>
