<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui/.';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
//******META*********
definePageMeta({
    layout: 'admin',
});

//******VARIABLES/STATES*********
const toast = useToast();
const isLoading = ref(false);
const currentDate = ref(new Date());
const breadcrumbItems: BreadcrumbItem[] = [
    {
        label: 'Panel administracyjny',
        to: '/dashboard',
    },
    {
        label: 'Operacje seryjne',
        to: '/dashboard/serial-operations',
    },
];

//******FUNCTIONS*********
const setNewDate = async (month: number) => {
    if (
        month > new Date().getMonth() &&
        currentDate.value.getFullYear() >= new Date().getFullYear()
    ) {
        toast.add({
            title: 'Błąd',
            description: 'Nie możesz wybrać miesiąca późniejszego niż obecny.',
            color: 'error',
            duration: 5000,
        });
        return;
    }

    const date = new Date(currentDate.value);
    date.setMonth(month);
    currentDate.value = date;
};
const downloadReportForEveryone = async () => {
    try {
        isLoading.value = true;

        const year = currentDate.value.getFullYear();
        const month = String(currentDate.value.getMonth() + 1).padStart(2, '0');

        const response = await fetch(
            `${
                useRuntimeConfig().public.apiBase
            }attendance/monthly-report/everyone/pdf/${year}/${month}`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        if (!response.ok) {
            toast.add({
                title: 'Nie udało się pobrać zestawienia',
                color: 'error',
                description: response.statusText,
            });
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        const filename = `Raport_Miesieczny_EVERYONE_${year}_${month}.pdf`;

        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        isLoading.value = false;
    } catch (e: any) {
        useFetchErrorHandler('Raport miesięczny', e);
    } finally {
        isLoading.value = false;
    }
};
const downloadAttendanceListForEveryone = async () => {
    try {
        isLoading.value = true;

        const year = currentDate.value.getFullYear();
        const month = String(currentDate.value.getMonth() + 1).padStart(2, '0');
        console.log(currentDate.value.getMonth());

        const response = await fetch(
            `${
                useRuntimeConfig().public.apiBase
            }attendance/monthly-report/attendance-list/everyone/pdf/${year}/${month}`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        if (!response.ok) {
            toast.add({
                title: 'Nie udało się pobrać zestawienia',
                color: 'error',
                description: response.statusText,
            });
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        const filename = `Lista_Obecnosci_EVERYONE_${year}_${month}.pdf`;

        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        isLoading.value = false;
    } catch (e: any) {
        useFetchErrorHandler('Lista obecności - miesięczna', e);
    } finally {
        isLoading.value = false;
    }
};
const downloadSummaryForEveryone = async () => {
    try {
        isLoading.value = true;

        const year = currentDate.value.getFullYear();
        const month = String(currentDate.value.getMonth() + 1).padStart(2, '0');
        console.log(currentDate.value.getMonth());

        const response = await fetch(
            `${
                useRuntimeConfig().public.apiBase
            }attendance/monthly-report/summary/everyone/json/${year}/${month}`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        if (!response.ok) {
            toast.add({
                title: 'Nie udało się pobrać zestawienia',
                color: 'error',
                description: response.statusText,
            });
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        const filename = `Podsumowanie_Miesieczne_EVERYONE_${year}_${month}.json`;

        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        isLoading.value = false;
    } catch (e: any) {
        useFetchErrorHandler('Lista obecności - miesięczna', e);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="space-y-8 mb-8">
        <UBreadcrumb :items="breadcrumbItems">
            <template #separator>
                <span class="mx-2 text-(--ui-text-muted)">/</span>
            </template>
        </UBreadcrumb>
        <div class="flex justify-between">
            <h1 class="text-2xl font-bold">Operacje seryjne</h1>
        </div>
    </div>

    <div class="flex justify-between items-center mb-8">
        <UButton icon="i-heroicons-chevron-left" @click="setNewDate(currentDate.getMonth() - 1)" />
        <p class="text-lg font-medium">
            {{ format(currentDate, 'LLLL yyyy', { locale: pl }) }}
        </p>
        <UButton icon="i-heroicons-chevron-right" @click="setNewDate(currentDate.getMonth() + 1)" />
    </div>

    <div class="grid grid-cols-3 w-full gap-12">
        <UButton
            @click="downloadReportForEveryone"
            class="flex justify-center"
            icon="i-lucide-clipboard-plus"
            variant="solid"
            color="primary"
            :loading="isLoading"
            >Raport PDF</UButton
        >
        <UButton
            @click="downloadAttendanceListForEveryone"
            class="flex justify-center"
            icon="i-lucide-check"
            variant="solid"
            color="info"
            :loading="isLoading"
            >Lista obecności</UButton
        >
        <UButton
            @click="downloadSummaryForEveryone"
            class="flex justify-center"
            icon="i-lucide-file-digit"
            variant="solid"
            color="warning"
            :loading="isLoading"
            >Podsumowanie Miesięczne</UButton
        >
    </div>
</template>
