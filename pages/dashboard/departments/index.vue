<script setup lang="ts">
import type { TableColumn, BreadcrumbItem } from '@nuxt/ui/.';

//******META*********
definePageMeta({ layout: 'admin' });

//******VARIABLES/STATES*********
type Department = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
const router = useRouter();
const api = useApi();
const departments = ref<any[]>([]);
const isLoading = ref(false);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Oddziały',
    to: '/dashboard/departments',
  },
];

//******DATA TABLE*********
const columns: TableColumn<Department>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (row: any) => {
      const departmentId = row.getValue('id');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/departments/${departmentId}`,
          class: 'text-primary underline',
        },
        () => `#${departmentId}`
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Nazwa',
    cell: (row: any) => {
      const departmentId = row.getValue('id');
      const departmentName = row.getValue('name');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/departments/${departmentId}`,
          class: 'text-primary underline',
        },
        () => `${departmentName}`
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Utworzono',
    cell: (row: any) => {
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
    cell: (row: any) => {
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
const fetchDepartments = async () => {
  isLoading.value = true;
  try {
    const response = await api.department.getAllDepartments();
    departments.value = response.departments;
  } catch (e: any) {
    useFetchErrorHandler('Oddział firmy', e);
  }

  isLoading.value = false;
};
onMounted(async () => {
  await fetchDepartments();
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
      <h1 class="text-2xl font-bold">Oddziały</h1>
      <UButton
        icon="i-lucide-building"
        label="Dodaj oddział"
        @click="router.push('/dashboard/departments/create')"
      />
    </div>

    <div class="flex flex-col space-y-8 flex-1 w-full">
      <UCard class="bg-zinc-100 dark:bg-zinc-800">
        <UTable
          :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
          :columns
          :data="departments"
        />
      </UCard>
    </div>
  </div>
</template>
