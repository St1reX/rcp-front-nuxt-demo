<script setup lang="ts">
import type { BreadcrumbItem } from '#ui/types';
import { FetchError } from 'ofetch';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
const route = useRoute();
const router = useRouter();
const api = useApi();
const toast = useToast();
const isLoading = ref(true);
const employmentTypeId = route.params.employment as string;
const employment = ref<any>(null);
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

//******FUNCTIONS*********
const fetchEmploymentType = async () => {
  isLoading.value = true;
  try {
    employment.value = await api.employment.getTypeById({ employmentTypeId });
    if (breadcrumbItems.length < 3) {
      breadcrumbItems.push({
        label: `${employment.value.name}`,
        to: `/dashboard/employment/${employment.value.id}`,
      });
    }
  } catch (e: any) {
    useFetchErrorHandler('Etat', e);
  }

  isLoading.value = false;
};
const deleteEmploymentType = async (): Promise<void> => {
  try {
    await api.employment.delete({ employmentId: employmentTypeId });
    router.push('/dashboard/employment');

    toast.add({
      title: 'Sukces',
      description: 'Pracownik został usunięty poprawnie',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Etat', e);
  }
};
onMounted(async () => {
  await fetchEmploymentType();
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
      <h1 class="text-2xl font-bold">Etat</h1>
      <UModal
        title="Usuwanie etatu"
        description="Czy napewno chcesz usunąć etat? (Etat nie może być przypisany do żadnego pracownika aby mógł być usunięty.)"
        :dismissible="false"
      >
        <UButton label="Usuń etat" color="error" />

        <template #footer>
          <UButton
            label="Usuń etat"
            icon="i-heroicons-x-mark"
            color="error"
            @click="deleteEmploymentType"
          />
        </template>
      </UModal>
    </div>

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <form>
        <UFormField label="ID" name="id">
          <UInput
            disabled
            class="w-full cursor-not-allowed"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            v-model="employment.id"
          />
        </UFormField>
        <UFormField label="Nazwa" name="name">
          <UInput
            disabled
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            v-model="employment.name"
          />
        </UFormField>
        <UFormField label="Czas pracy(godziny)" name="workingHours">
          <UInput
            disabled
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :model-value="employment.workingHours + 'h'"
          />
        </UFormField>
        <UFormField label="Czas przerwy(minuty)" name="breakTimeMinutes">
          <UInput
            disabled
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :model-value="employment.breakTimeMinutes + 'min'"
          />
        </UFormField>
        <UFormField label="Utworzono" name="createdAt">
          <UInput
            disabled
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :model-value="
              new Date(employment.createdAt).toLocaleDateString() +
              ' ' +
              new Date(employment.createdAt).toLocaleTimeString()
            "
          />
        </UFormField>
        <UFormField label="Ostatnia modyfikacja" name="updatedAt">
          <UInput
            disabled
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :model-value="
              new Date(employment.updatedAt).toLocaleDateString() +
              ' ' +
              new Date(employment.updatedAt).toLocaleTimeString()
            "
          />
        </UFormField>
      </form>
    </UCard>
  </div>
</template>
