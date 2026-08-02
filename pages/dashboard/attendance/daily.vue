<script setup lang="ts">
import type { BreadcrumbItem, TableColumn } from '#ui/types';
import type { Column } from '@tanstack/vue-table';
import { FetchError } from 'ofetch';
import { truncateText } from '#imports';
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  today,
} from '@internationalized/date';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
type Attendance = {
  id: string;
  date: string;
  employee: { id: string; firstName: string; lastName: string };
  reader: { id: string; name: string };
  action: string;
};
const UButton = resolveComponent('UButton');
const dataForTable = ref<Attendance[]>([]);
const route = useRoute();
const api = useApi();
const isLoading = ref<boolean>(false);
const cardReads = ref<any[]>([]);
const selectedDate = shallowRef<CalendarDate | null>(today('Europe/Warsaw'));
const currentDate = today('Europe/Warsaw');
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Wszystkie odczyty',
    to: '/dashboard/attendance/unregistered',
  },
];
const dateFormatter = new DateFormatter('pl-PL', {
  dateStyle: 'medium',
});

//******DATA TABLE*********
const columns: TableColumn<Attendance>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return h(
        'span',
        { class: 'text-ellipsis' },
        `#${truncateText(row.getValue('id'), 8)}`
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleString('pl-PL', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },
  },
  {
    accessorKey: 'employee',
    header: 'Pracownik',
    cell: ({ row }) => {
      const employee = row.getValue('employee') as {
        id: string;
        firstName: string;
        lastName: string;
      };
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/employees/${employee.id}`,
          class: 'text-primary underline',
        },
        () => `${employee.firstName + ' ' + employee.lastName}`
      );
    },
  },
  {
    accessorKey: 'reader',
    header: 'Czytnik',
    cell: ({ row }) => {
      return h(
        (() => {
          const reader = row.getValue('reader') as { id: string; name: string };
          if (!reader) return '';
          return h(
            resolveComponent('NuxtLink'),
            {
              to: `/dashboard/readers/${reader.id}`,
              class: 'text-primary underline',
            },
            () => `${reader.name}`
          );
        })()
      );
    },
  },
  {
    accessorKey: 'action',
    header: 'Akcja',
    cell: ({ row }) => `${row.getValue('action')}`,
  },
];

//******FUNCTIONS*********
watch(selectedDate, async (newValue, oldValue) => {
  if (!newValue) {
    selectedDate.value = oldValue;
    return;
  }
  await loadReads(selectedDate.value);
});
const loadReads = async (date: CalendarDate | null) => {
  isLoading.value = true;
  dataForTable.value = [];
  const selectedDateString = date!.toString();

  try {
    const response = await api.attendance.getAttendanceForDate({
      date: selectedDateString,
    });

    cardReads.value = response.attendances || [];
    for (let i = 0; i < cardReads.value.length; i++) {
      const responseDate = new Date(cardReads.value[i].timestamp);
      const formattedDate =
        responseDate.getFullYear() +
        '-' +
        String(responseDate.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(responseDate.getDate()).padStart(2, '0');

      if (selectedDateString != formattedDate) {
        continue;
      }

      const attendanceRecord: Attendance = {
        id: cardReads.value[i].id,
        date: new Date(cardReads.value[i].timestamp).toISOString(),
        employee: cardReads.value[i].employee,
        reader: cardReads.value[i].reader,
        action:
          cardReads.value[i].metadata.action === 'EXIT' ? 'Wyjście' : 'Wejście',
      };

      dataForTable.value.push(attendanceRecord);
    }
  } catch (e: any) {
    useFetchErrorHandler('Obecności', e);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  if (route.query.date) {
    selectedDate.value = new CalendarDate(
      Number(route.query.date?.slice(0, 4)),
      Number(route.query.date?.slice(5, 7)),
      Number(route.query.date?.slice(8))
    );
  } else {
    selectedDate.value = today('Europe/Warsaw');
  }
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
      <h1 class="text-2xl font-bold">Odczyty kart z danego dnia</h1>
      <UPopover>
        <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
          {{
            selectedDate
              ? dateFormatter.format(selectedDate.toDate(getLocalTimeZone()))
              : 'Select a date'
          }}
        </UButton>

        <template #content>
          <UCalendar v-model="selectedDate" :max-value="currentDate" class="p-2" />
        </template>
      </UPopover>
    </div>

    <div class="flex flex-col gap-8 flex-1 w-full">
      <div class="w-full">
        <UCard class="bg-zinc-100 dark:bg-zinc-800">
          <div v-if="!selectedDate">
            <p class="text-center text-gray-500 dark:text-gray-400">Wybierz datę</p>
          </div>
          <div v-else-if="dataForTable.length === 0 && !isLoading">
            <p class="text-center text-gray-500 dark:text-gray-400">
              Brak odczytów dla podanego dnia
            </p>
          </div>
          <div v-else>
            <UTable
              :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
              :data="dataForTable"
              :columns="columns"
            />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
