<script setup lang="ts">
import type { TableColumn, BreadcrumbItem } from '#ui/types';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
type Employee = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  department: {
    id: string;
    name: string;
  } | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};
const { filterArrayOrdered } = useFilterArray<Employee>();
const api = useApi();
const toast = useToast();
const router = useRouter();
const total = ref<number>(0);
const searchQuery = ref<string>('');
const employees = ref<Employee[]>([]);
const filteredEmployees = ref<Employee[]>([]);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Pracownicy',
    to: '/dashboard/employees',
  },
];

//******DATA TABLE*********
const columns: TableColumn<Employee>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/employees/${id}`,
          class: 'text-primary underline',
        },
        () => `#${id}`
      );
    },
  },
  {
    accessorKey: 'firstName',
    header: 'Imię',
    cell: ({ row }) => {
      const id = row.getValue('id');
      const name = row.getValue('firstName');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/employees/${id}`,
          class: `text-primary`,
        },
        () => name
      );
    },
  },
  {
    accessorKey: 'middleName',
    header: 'Drugie imię',
    cell: ({ row }) => {
      const id = row.getValue('id');
      const middleName = row.getValue('middleName') || '-';
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/employees/${id}`,
          class: `text-primary`,
        },
        () => middleName
      );
    },
  },
  {
    accessorKey: 'lastName',
    header: 'Nazwisko',
    cell: ({ row }) => {
      const id = row.getValue('id');
      const lastName = row.getValue('lastName');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/employees/${id}`,
          class: `text-primary`,
        },
        () => lastName
      );
    },
  },
  {
    accessorKey: 'department',
    header: 'Dział firmy',
    cell: ({ row }) => {
      const department = row.getValue('department') as { name: string; id: string };

      if (department) {
        return h(
          resolveComponent('NuxtLink'),
          {
            to: `/dashboard/departments/${department.id}`,
            class: `text-primary underline`,
          },
          () => department.name
        );
      } else {
        return 'Nieprzypisany';
      }
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Dodano',
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
watch(searchQuery, () => {
  filterArrayOrdered(
    employees,
    filteredEmployees,
    ['lastName', 'firstName'],
    searchQuery
  );
});
const getEmployees = async () => {
  try {
    const result = await api.employee.getAll({});

    employees.value = result.employees || [];
    filteredEmployees.value = employees.value;
    total.value = result.count;
  } catch (e: any) {
    useFetchErrorHandler('Pracownicy', e);
  }
};
onMounted(async () => {
  await getEmployees();
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
      <h1 class="text-2xl font-bold">Pracownicy</h1>
      <div class="flex justify-center items-center gap-4">
        <UInput
          icon="i-lucide-search"
          size="md"
          variant="outline"
          placeholder="Wyszukaj pracownika"
          v-model="searchQuery"
        />
        <UButton
          icon="i-lucide-user"
          label="Dodaj pracownika"
          @click="router.push('/dashboard/employees/create')"
        />
      </div>
    </div>

    <div class="flex flex-col space-y-8 flex-1 w-full" v-if="employees.length">
      <UCard class="bg-zinc-100 dark:bg-zinc-800"
        ><UTable
          :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
          :columns
          :data="filteredEmployees"
      /></UCard>
    </div>
    <div v-else>Brak pracowników</div>
  </div>
</template>
