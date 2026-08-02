<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import { AssignCardSchema, type AssignCardRequest } from '~/types/schemas/card';

//******HOOKS*********
const route = useRoute();
const api = useApi();
const toast = useToast();
const router = useRouter();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const employeeId = route.query.employeeId as string;
const state = reactive<Partial<AssignCardRequest>>({
  employeeId: employeeId,
  cardKey: '',
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<AssignCardRequest>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.card.assignCardToEmployee({
      cardKey: event.data.cardKey,
      employeeId: event.data.employeeId,
    });

    toast.add({
      title: `Sukces`,
      description: 'Karta została przypisana poprawnie',
      color: 'success',
      duration: 3000,
    });

    router.push(`/dashboard/employees/${employeeId}`);
  } catch (e: any) {
    useFetchErrorHandler('Karta pracownicza', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>Przypisywanie karty do pracownika</template>

      <UForm :schema="AssignCardSchema" :state @submit="onSubmit" class="space-y-4">
        <UFormField label="ID pracownika" name="employeeId">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800 cursor-not-allowed"
            disabled
            v-model="state.employeeId"
            type="text"
          />
        </UFormField>
        <UFormField label="Klucz karty" name="cardKey">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800 cursor-not-allowed"
            v-model="state.cardKey"
            type="text"
          />
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading">
            Przypisz kartę
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
