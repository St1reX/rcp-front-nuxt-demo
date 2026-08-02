<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui/.';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
//******META*********
definePageMeta({
  layout: 'leaves-manager',
});

//******VARIABLES/STATES*********
const toast = useToast();
const isLoading = ref(false);
const currentDate = ref(new Date());
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/leaves/managment',
  },
  {
    label: 'Operacje seryjne',
    to: '/leaves/managment/serial-operations',
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
const downloadMonthlyReportOTPIMA = async () => {
  try {
    isLoading.value = true;

    const year = currentDate.value.getFullYear();
    const month = String(currentDate.value.getMonth() + 1).padStart(2, '0');

    const response = await fetch(
      `${useRuntimeConfig().public.apiBase}leave/report/xlsx/${year}/${month}`,
      {
        method: 'GET',
        credentials: 'include',
      }
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

    const filename = `Raport_Miesieczny_urlopy_OPTIMA_${year}_${month}.xlsx`;

    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    isLoading.value = false;
  } catch (e: any) {
    useFetchErrorHandler('Raport OPTIMA', e);
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

  <div class="grid grid-cols-3 w-full gap-12">
    <UButton
      @click="downloadMonthlyReportOTPIMA"
      class="flex justify-center"
      variant="solid"
      color="primary"
      :loading="isLoading"
      >Raport OPTIMA</UButton
    >
  </div>
</template>
