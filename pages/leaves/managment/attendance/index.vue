<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { h, resolveComponent } from 'vue';
import { truncateText } from '#imports';
import type { Column } from '@tanstack/vue-table';
import type { BreadcrumbItem } from '#ui/types';

//******META*********
definePageMeta({
    layout: 'leaves-manager',
});

//******VARIABLES/STATES*********
type Attendance = {
    id: string;
    date: string;
    card: string;
    reader: string;
    action: string;
};
const api = useApi();
const currentDate = ref(new Date());
const toast = useToast();
const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const router = useRouter();
const route = useRoute();
const employees = ref<any[]>([]);
const employeesSelectItems = ref<any[]>([]);
const selectedEmployeeId = ref<string | null>(null);
const attendance = ref<any[]>([]);
const dataForTable = ref<Attendance[]>([]);
const isLoading = ref(false);
const total = ref<number>(0);
const breadcrumbItems: BreadcrumbItem[] = [
    {
        label: 'Panel administracyjny',
        to: '/leaves/managment',
    },
    {
        label: 'Obecności',
        to: '/leaves/managment/attendance',
    },
];
const sorting = ref([
    {
        id: 'date',
        desc: true,
    },
]);
const filters = ref([
    {
        id: 'card',
        value: '',
    },
]);

//******DATA TABLE*********
const columns: TableColumn<Attendance>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => getHeader(column, 'ID'),
        cell: ({ row }) => {
            return h('span', { class: 'text-ellipsis' }, `#${truncateText(row.getValue('id'), 8)}`);
        },
    },
    {
        accessorKey: 'date',
        header: ({ column }) => getHeader(column, 'Data'),
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
        accessorKey: 'card',
        header: ({ column }) => getHeader(column, 'Karta'),
        cell: ({ row }) => {
            const card = row.getValue('card') as string;
            return h(
                resolveComponent('NuxtLink'),
                {
                    to: `/dashboard/cards/${card}`,
                    class: 'text-primary underline',
                },
                () => `#${truncateText(card, 8)}`,
            );
        },
    },
    {
        accessorKey: 'reader',
        header: ({ column }) => getHeader(column, 'Czytnik'),
        cell: ({ row }) => {
            const reader = row.getValue('reader') as { id: string; name: string };
            return h(
                resolveComponent('NuxtLink'),
                {
                    to: `/dashboard/readers/${reader.id}`,
                    class: 'text-primary underline',
                },
                () => `${reader.name}`,
            );
        },
    },
    {
        accessorKey: 'action',
        header: ({ column }) => getHeader(column, 'Akcja'),
        cell: ({ row }) => `${row.getValue('action')}`,
    },
];
const getHeader = (column: Column<Attendance>, label: string) => {
    const isSorted = column.getIsSorted();

    return h(
        UDropdownMenu,
        {
            content: {
                align: 'start',
            },
            'aria-label': 'Actions dropdown',
            items: [
                {
                    label: 'Rosnąco',
                    type: 'checkbox',
                    icon: 'i-lucide-arrow-up-narrow-wide',
                    checked: isSorted === 'asc',
                    onSelect: () => {
                        if (isSorted === 'asc') {
                            column.clearSorting();
                        } else {
                            column.toggleSorting(false);
                        }
                    },
                },
                {
                    label: 'Malejąco',
                    icon: 'i-lucide-arrow-down-wide-narrow',
                    type: 'checkbox',
                    checked: isSorted === 'desc',
                    onSelect: () => {
                        if (isSorted === 'desc') {
                            column.clearSorting();
                        } else {
                            column.toggleSorting(true);
                        }
                    },
                },
            ],
        },
        () =>
            h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                label,
                icon: isSorted
                    ? isSorted === 'asc'
                        ? 'i-lucide-arrow-up-narrow-wide'
                        : 'i-lucide-arrow-down-wide-narrow'
                    : 'i-lucide-arrow-up-down',
                class: '-mx-2.5 data-[state=open]:bg-(--ui-bg-elevated)',
                'aria-label': `Sortuj ${isSorted === 'asc' ? 'malejąco' : 'rosnąco'}`,
            }),
    );
};

//******FUNCTIONS*********
const fetchEmployees = async () => {
    try {
        const response = await api.employee.getAll({ limit: 200, offset: 0 });
        employees.value = response.employees;
        employeesSelectItems.value = [];

        for (let i = 0; i < employees.value.length; i++) {
            const item = {
                label: employees.value[i].firstName + ' ' + employees.value[i].lastName,
                value: employees.value[i].id,
            };

            employeesSelectItems.value.push(item);
        }
    } catch (e: any) {
        useFetchErrorHandler('Pracownicy', e);
    }
};
const fetchAttendance = async () => {
    if (!selectedEmployeeId.value) return;
    isLoading.value = true;

    try {
        const data = await api.attendance.getMonthlyAttendanceForEmployee({
            employeeId: selectedEmployeeId.value,
            year: currentDate.value.getFullYear().toString(),
            month:
                currentDate.value.getMonth() + 1 < 10
                    ? '0' + (currentDate.value.getMonth() + 1).toString()
                    : (currentDate.value.getMonth() + 1).toString(),
        });

        attendance.value = data.attendances || [];
        // total.value = Math.ceil(data.count / limit.value);
        total.value = data.count;
        isLoading.value = false;
        dataForTable.value = [];

        for (let i = 0; i < attendance.value.length; i++) {
            const attendanceRecord: Attendance = {
                id: attendance.value[i].id,
                date: new Date(attendance.value[i].timestamp).toISOString(),
                card: attendance.value[i].card.id,
                reader: attendance.value[i].reader,
                action: attendance.value[i].metadata.action === 'EXIT' ? 'Wyjście' : 'Wejście',
            };

            dataForTable.value.push(attendanceRecord);
        }
    } catch (e: any) {
        useFetchErrorHandler('Obecności', e);
    }
};
const setNewDate = async (month: number) => {
    if (!selectedEmployeeId.value) {
        toast.add({
            title: 'Nie wybrano pracownika',
            color: 'error',
            description: 'Wybierz pracownika aby móc przeglądać rekordy',
        });

        return;
    }
    currentDate.value.setMonth(month);
    await fetchAttendance();
};
const seeMonthlyReport = () => {
    router.push({
        path: '/leaves/managment/attendance/monthly-report',
        query: {
            employeeId: selectedEmployeeId.value,
            year: currentDate.value.getFullYear().toString(),
            month: (currentDate.value.getMonth() + 1).toString(),
            name: employeesSelectItems.value.find(
                (employee) => employee.value === selectedEmployeeId.value,
            ).label,
        },
    });
};
watch(selectedEmployeeId, fetchAttendance);
onMounted(async () => {
    await fetchEmployees();

    if (route.query.employeeId && typeof route.query.employeeId === 'string') {
        selectedEmployeeId.value = route.query.employeeId;
    }
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
            <h1 class="text-2xl font-bold">Obecności pracowników</h1>
            <div class="flex items-center gap-2" v-if="selectedEmployeeId">
                <UButton
                    color="primary"
                    label="Zobacz raport"
                    v-if="total > 0"
                    @click="seeMonthlyReport"
                />
            </div>
        </div>

        <!-- Wybór pracownika -->
        <div class="space-y-2">
            <h2 class="text-lg font-bold">Wybierz pracownika</h2>
            <USelectMenu
                :items="employeesSelectItems"
                v-model="selectedEmployeeId"
                :loading="isLoading"
                value-key="value"
                loading-icon="i-lucide-loader"
                selected-icon="i-lucide-check"
                :search-input="{
                    placeholder: 'Znajdź pracownika',
                    icon: 'i-lucide-search',
                }"
                placeholder="Nie wybrano"
                class="w-full"
            />
        </div>

        <!-- Nawigacja miesiąca -->
        <div class="flex justify-between items-center">
            <UButton
                icon="i-heroicons-chevron-left"
                @click="setNewDate(currentDate.getMonth() - 1)"
            />
            <p class="text-lg font-medium">
                {{ format(currentDate, 'LLLL yyyy', { locale: pl }) }}
            </p>
            <UButton
                icon="i-heroicons-chevron-right"
                @click="setNewDate(currentDate.getMonth() + 1)"
            />
        </div>

        <!-- Tabela obecności -->
        <div class="flex flex-col flex-1 w-full" v-if="attendance.length">
            <UCard class="bg-zinc-100 dark:bg-zinc-800">
                <UTable
                    ref="table"
                    :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
                    v-model:sorting="sorting"
                    v-model:filters="filters"
                    :data="dataForTable"
                    :columns="columns"
                />
            </UCard>
        </div>

        <div v-else-if="selectedEmployeeId && !isLoading" class="text-gray-500 text-center py-10">
            Brak danych o odczytach dla wybranego miesiąca.
        </div>
    </div>
</template>
