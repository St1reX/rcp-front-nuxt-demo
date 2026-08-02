<script setup lang="ts">
import type { BreadcrumbItem } from '#ui/types';
//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
const route = useRoute();
const adjustmentId = route.params.adjustment as string;
const api = useApi();
const router = useRouter();
const toast = useToast();
const adjustment = ref<any>(null);
const isLoading = ref(true);
const editable = ref(false);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Dostosowania dni pracy',
    to: '/dashboard/workday-adjustments',
  },
];
const adjustmentTypes = [
  {
    label: 'Późniejsze rozpoczęcie pracy',
    value: 'LATE_START',
  },
  {
    label: 'Wcześniejszy koniec pracy',
    value: 'EARLY_END',
  },
];

//******FUNCTIONS*********
const fetchAdjustments = async () => {
  isLoading.value = true;
  try {
    adjustment.value = await api.workdayAdjustment.getById({ adjustmentId });
    if (breadcrumbItems.length < 3) {
      breadcrumbItems.push({
        label: adjustment.value.reason
          ? adjustment.value.reason
          : adjustment.value.id,
        to: `/dashboard/workday-adjustments/${adjustment.value.id}`,
      });
    }
  } catch (e: any) {
    useFetchErrorHandler('Dostosowanie godzin pracy', e);
  } finally {
    isLoading.value = false;
  }
};
const deleteAdjustment = async () => {
  try {
    await api.workdayAdjustment.delete({ id: adjustmentId });
    router.push('/dashboard/workday-adjustments');

    toast.add({
      title: 'Sukces',
      description: 'Dostosowanie zostało usunięte poprawnie',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Dostosowanie godzin pracy', e);
  }
};
onMounted(async () => {
  await fetchAdjustments();
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
      <h1 class="text-2xl font-bold">Szczegóły dostosowania dnia pracy</h1>
      <UButton
        label="Usuń dostosowanie dnia pracy"
        icon="i-heroicons-x-mark"
        color="error"
        @click="deleteAdjustment"
      />
    </div>

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <form class="flex flex-col gap-4">
        <UFormField label="ID" name="id">
          <UInput
            v-model="adjustment.id"
            disabled
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            class="cursor-not-allowed w-full"
          />
        </UFormField>
        <UFormField label="Data" name="date">
          <UInput
            :disabled="!editable"
            :model-value="
              new Date(adjustment.date).toLocaleDateString() +
              ' ' +
              new Date(adjustment.date).toLocaleTimeString()
            "
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
        <UFormField label="Godzina" name="time">
          <UInput
            :disabled="!editable"
            :model-value="adjustment.time"
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
        <UFormField label="Powód" name="reason">
          <UInput
            :disabled="!editable"
            :model-value="adjustment.reason"
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
        <UFormField label="Typ" name="type">
          <USelect
            :items="adjustmentTypes"
            :disabled="!editable"
            v-model="adjustment.type"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            class="bg-zinc-100 dark:bg-zinc-950 w-full"
          />
        </UFormField>
        <UFormField label="Utworzono" name="createdAt">
          <UInput
            class="w-full"
            disabled
            :model-value="
              new Date(adjustment.createdAt).toLocaleDateString() +
              ' ' +
              new Date(adjustment.createdAt).toLocaleTimeString()
            "
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
        <UFormField label="Ostatnia modyfikacja" name="updatedAt">
          <UInput
            class="w-full"
            disabled
            :model-value="
              new Date(adjustment.updatedAt).toLocaleDateString() +
              ' ' +
              new Date(adjustment.updatedAt).toLocaleTimeString()
            "
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
      </form>
    </UCard>
  </div>
</template>
