<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import {
  CreateEmploymentTypeSchema,
  type CreateEmploymentTypeRequest,
} from '~/types/schemas/employment';

//******HOOKS*********
const api = useApi();
const toast = useToast();
const router = useRouter();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const state = reactive<Partial<CreateEmploymentTypeRequest>>({
  name: '',
  workingHours: 0,
  breakTimeMinutes: 0,
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<CreateEmploymentTypeRequest>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.employment.create({
      name: event.data.name,
      workingHours: event.data.workingHours,
      breakTimeMinutes: event.data.breakTimeMinutes,
    });

    toast.add({
      title: `Sukces`,
      description: 'Etat został dodany poprawnie',
      color: 'success',
      duration: 3000,
    });

    router.push('/dashboard/employment');
  } catch (e: any) {
    useFetchErrorHandler('Etat pracownika', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Dodawanie etatu</h1>
      </template>

      <UForm
        :schema="CreateEmploymentTypeSchema"
        :state
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="Nazwa" name="name">
          <UInput class="w-full" v-model="state.name" type="text" />
        </UFormField>
        <UFormField label="Czas pracy (godziny)" name="workingHours">
          <UInput
            class="w-full"
            v-model="state.workingHours"
            type="number"
            min="1"
            max="24"
          />
        </UFormField>
        <UFormField label="Czas przerwy (minuty)" name="breakTimeMinutes">
          <UInput
            class="w-full"
            v-model="state.breakTimeMinutes"
            type="number"
            min="0"
            max="1440"
          />
        </UFormField>

        <div class="pt-2">
          <UButton label="Dodaj etat" block :loading="isLoading" type="submit" />
        </div>
      </UForm>
    </UCard>
  </div>
</template>
