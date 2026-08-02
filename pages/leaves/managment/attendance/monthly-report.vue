<script setup lang="ts">
import type { TableColumn, BreadcrumbItem } from '#ui/types';

//******META*********
definePageMeta({
    layout: 'leaves-manager',
});

//******VARIABLES/STATES*********
type ReportData = {
    date: string;
    type: string;
    requiredHours: number;
    requiredMinutes: number;
    workedHours: number;
    workedMinutes: number;
    shortBreakTime: string;
    startTime: string;
    endTime: string;
};
const route = useRoute();
const query = route.query;
const api = useApi();
const month = ref(query.month as string);
const year = ref(query.year as string);
const employeeId = ref(query.employeeId as string);
const employeeName = ref(query.name as string);
const report = ref<any>();
const breadcrumbItems: BreadcrumbItem[] = [
    {
        label: 'Panel administracyjny',
        to: '/leaves/managment',
    },
    {
        label: 'Obecności',
        to: '/leaves/managment/attendance',
    },
    {
        label: `Raport miesięczny - ${employeeName.value}`,
        to: `/leaves/managment/attendance/monthly-report?employeeId=${employeeId.value}&year=${year.value}&month=${month.value}&name=${employeeName.value}`,
    },
];

//******DATA TABLE*********
const columns: TableColumn<ReportData>[] = [
    {
        accessorKey: 'date',
        header: 'Data',
        cell: ({ row }) => row.getValue('date'),
    },
    {
        accessorKey: 'type',
        header: 'Typ dnia',
        cell: ({ row }) => {
            const type = row.getValue('type');
            if (type === 'Saturday') {
                return 'Sobota';
            }
            if (type === 'Sunday') {
                return 'Niedziela';
            }
            if (type === 'Holiday') {
                return 'Dzień wolny';
            }
            if (type === 'Workday') {
                return 'Dzień roboczy';
            }
            return type;
        },
    },
    {
        accessorKey: 'startTime',
        header: 'Godzina rozpoczęcia pracy',
        cell: ({ row }) => {
            const value: string | Date = row.getValue('startTime');
            if (value === 'N/A') {
                return '-';
            }
            return value;
        },
    },
    {
        accessorKey: 'endTime',
        header: 'Godzina zakończenia pracy',
        cell: ({ row }) => {
            const value: string | Date = row.getValue('endTime');
            if (value === 'N/A') {
                return '-';
            }
            return value;
        },
    },
    {
        accessorKey: 'date',
        header: 'Do przepracowania',
        cell: ({ row }) => {
            const date: string = row.getValue('date');

            const record: ReportData = report.value!.reportData.find(
                (record: ReportData) => record.date === date,
            );

            const requiredHours: number = record.requiredHours;
            const requiredMinutes: number = record.requiredMinutes;

            if (requiredHours === 0 && requiredMinutes === 0) {
                return '-';
            }
            return `${requiredHours}h ${requiredMinutes}min`;
        },
    },
    {
        accessorKey: 'date',
        header: 'Przepracowane',
        cell: ({ row }) => {
            const date: string = row.getValue('date');

            const record: ReportData = report.value!.reportData.find(
                (record: ReportData) => record.date === date,
            );

            const workedHours: number = record.workedHours;
            const workedMinutes: number = record.workedMinutes;

            if (workedHours === 0 && workedMinutes === 0) {
                return '-';
            }

            return `${workedHours}h ${workedMinutes}min`;
        },
    },
    {
        accessorKey: 'shortBreakTime',
        header: 'Czas przerwy',
        cell: ({ row }) => {
            const value: number = row.getValue('shortBreakTime');
            if (value === 0) {
                return '-';
            }
            return `${Math.floor(value / 60)}h ${Math.round(value % 60)}min`;
        },
    },
];

//******FUNCTIONS*********
const fetchMonthlyReport = async () => {
    try {
        const result = await api.attendance.generateMonthlyReportForEmployee({
            employeeId: employeeId.value,
            month: parseInt(month.value) < 10 ? '0' + month.value : month.value,
            year: year.value,
        });

        report.value = result;
    } catch (e: any) {
        useFetchErrorHandler('Raport miesięczny', e);
    }
};
onMounted(async () => {
    await fetchMonthlyReport();
});
</script>

<template>
    <div class="space-y-8">
        <UBreadcrumb :items="breadcrumbItems">
            <template #separator>
                <span class="mx-2 text-(--ui-text-muted)">/</span>
            </template>
        </UBreadcrumb>
        <div class="flex justify-between items-center">
            <h1 class="text-2-xl font-bold">
                Raport miesięczny dla pracownika: {{ employeeName }}
            </h1>
        </div>

        <div class="flex flex-col space-y-8 flex-1 w-full" v-if="report">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardStatCard
                    title="Czas pracy"
                    :value="report.totalWorkedHours + 'h ' + report.totalWorkedMinutes + 'min'"
                    icon="i-heroicons-clock"
                />
                <DashboardStatCard
                    title="Wymagany czas pracy"
                    :value="
                        report.requiredMonthlyHours + 'h ' + report.requiredMonthlyMinutes + 'min'
                    "
                    icon="i-heroicons-calendar-days"
                />
                <DashboardStatCard
                    title="Różnica względem normy"
                    :value="report.totalDeficitHours + 'h ' + report.totalDeficitMinutes + 'min'"
                    icon="i-heroicons-scale"
                />
                <DashboardStatCard
                    title="Nadgodziny w soboty"
                    :value="
                        report.overtimeSaturdaysHours +
                        'h ' +
                        report.overtimeSaturdaysMinutes +
                        'min'
                    "
                    icon="i-heroicons-sparkles"
                />
                <DashboardStatCard
                    title="Nadgodziny w tygodniu"
                    :value="
                        report.overtimeWeekdaysHours + 'h ' + report.overtimeWeekdaysMinutes + 'min'
                    "
                    icon="i-heroicons-bolt"
                />
                <DashboardStatCard
                    title="Łącznie nadgodzin"
                    :value="report.finalOvertimeHours + 'h ' + report.finalOvertimeMinutes + 'min'"
                    icon="i-heroicons-arrow-trending-up"
                />
            </div>
            <UCard class="bg-zinc-100 dark:bg-zinc-800">
                <UTable
                    :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
                    sticky
                    :columns="columns"
                    :data="report.reportData"
                    class="flex-1 max-h-[318px]"
                />
            </UCard>
        </div>
        <div v-else class="text-gray-500 text-center py-10">Brak raportu dla wybranych danych</div>
    </div>
</template>
