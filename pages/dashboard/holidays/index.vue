<script setup lang="ts">
import type { TableColumn, BreadcrumbItem } from '#ui/types';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
type Holiday = {
  name: string;
  date: string;
  id?: string;
  isFixed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
const api = useApi();
const toast = useToast();
const holidays = ref<any[]>([]);
const isLoading = ref(true);
const currentDate = ref<Date>(new Date());
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Dni wolne',
    to: '/dashboard/holidays',
  },
];

//******DATA TABLE*********
const columns: TableColumn<Holiday>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id');
      if (!id) {
        return '-';
      }
      return `#${id}`;
    },
  },
  {
    accessorKey: 'name',
    header: 'Nazwa',
    cell: ({ row }) => {
      const id = row.getValue('id');
      const name = row.getValue('name');
      return name;
    },
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      const rawDate = row.getValue('date');

      const [day, month, year] = (rawDate as string).split('.');

      const date = new Date(Number(year), Number(month) - 1, Number(day));

      return date.toLocaleDateString('pl-PL');
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Utworzone',
    cell: ({ row }) => {
      const rawDate = row.getValue('createdAt');

      if (!rawDate || Object.keys(rawDate).length < 1) return '-';

      const date = new Date(rawDate as string);

      return (
        date.toLocaleDateString('pl-PL') +
        ' ' +
        date.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
      );
    },
  },
  {
    header: 'Akcje',
    cell: ({ row }) => {
      const id = row.getValue('id');
      if (!id) return;

      return h(
        resolveComponent('UButton'),
        {
          onClick: () => deleteHoliday(id as string),
          color: 'error',
          label: 'Usuń',
          variant: 'subtle',
          class: 'cursor-pointer',
        },
        () => 'Usuń'
      );
    },
  },
];

//******FUNCTIONS*********
const setNewDate = async (year: number) => {
  currentDate.value.setFullYear(year);
  await fetchHolidays();
};
const fetchHolidays = async () => {
  isLoading.value = true;
  try {
    const response = await api.holiday.getForYear({
      year: currentDate.value.getFullYear(),
    });
    holidays.value = [...response].sort((a, b) => {
      const [aDay, aMonth, aYear] = a.date.split('.');
      const aDate = new Date(Number(aYear), Number(aMonth) - 1, Number(aDay));
      const [bDay, bMonth, bYear] = b.date.split('.');
      const bDate = new Date(Number(bYear), Number(bMonth) - 1, Number(bDay));

      return aDate.getTime() - bDate.getTime();
    });
  } catch (e: any) {
    useFetchErrorHandler('Święta', e);
  } finally {
    isLoading.value = false;
  }
};
const deleteHoliday = async (id: string) => {
  try {
    await api.holiday.delete({ id });
    await fetchHolidays();

    toast.add({
      title: 'Sukces',
      description: 'Święto zostało usunięte poprawnie',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Święta', e);
  }
};
onMounted(async () => {
  await fetchHolidays();
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
      <h1 class="text-2xl font-bold">Dni wolne</h1>
      <UButton
        label="Dodaj dzień wolny"
        color="success"
        icon="i-heroicons-calendar"
        to="/dashboard/holidays/create"
      />
    </div>

    <div class="flex justify-between items-center">
      <UButton
        icon="i-heroicons-chevron-left"
        @click="setNewDate(currentDate.getFullYear() - 1)"
      />
      <p class="text-lg font-medium">
        {{ currentDate.getFullYear() }}
      </p>
      <UButton
        icon="i-heroicons-chevron-right"
        @click="setNewDate(currentDate.getFullYear() + 1)"
      />
    </div>

    <div class="flex flex-col space-y-8 flex-1 w-full">
      <UCard class="bg-zinc-100 dark:bg-zinc-800">
        <UTable
          :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
          :data="holidays"
          :columns
        />
      </UCard>
    </div>
  </div>
</template>
