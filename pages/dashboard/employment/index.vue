<script setup lang="ts">
import type { TableColumn, BreadcrumbItem } from '#ui/types';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
type Employment = {
  id: string;
  name: string;
  workingHours: number;
  breakTimeMinutes: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};
const api = useApi();
const employmentTypes = ref<any[]>([]);
const isLoading = ref(true);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Etaty',
    to: '/dashboard/employment',
  },
];

//******DATA TABLE*********
const columns: TableColumn<Employment>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/employment/${id}`,
          class: 'text-primary underline',
        },
        () => `#${id}`
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Nazwa',
    cell: ({ row }) => {
      const name = row.getValue('name');
      const id = row.getValue('id');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/employment/${id}`,
          class: 'text-primary underline',
        },
        () => name
      );
    },
  },
  {
    accessorKey: 'workingHours',
    header: 'Norma',
    cell: ({ row }) => {
      const workingHours = row.getValue('workingHours');
      return `${workingHours}h`;
    },
  },
  {
    accessorKey: 'breakTimeMinutes',
    header: 'Czas przerwy',
    cell: ({ row }) => {
      const breakTimeMinutes = row.getValue('breakTimeMinutes');
      return `${breakTimeMinutes}min`;
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
const fetchEmploymentTypes = async () => {
  isLoading.value = true;
  try {
    const response = await api.employment.getAllType();
    employmentTypes.value = response.employmentTypes;
  } catch (e: any) {
    useFetchErrorHandler('Etaty', e);
  }

  isLoading.value = false;
};
onMounted(async () => {
  await fetchEmploymentTypes();
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
      <h1 class="text-2xl font-bold">Etaty</h1>
      <UButton
        label="Dodaj nowy etat"
        color="success"
        icon="i-lucide-scroll-text"
        to="/dashboard/employment/create"
      />
    </div>

    <div class="flex flex-col space-y-8 flex-1 w-full">
      <UCard class="bg-zinc-100 dark:bg-zinc-800">
        <UTable
          :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
          :columns
          :data="employmentTypes"
        />
      </UCard>
    </div>
  </div>
</template>
