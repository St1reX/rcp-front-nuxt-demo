<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import {
  type CreateAdjustmentRequest,
  CreateAdjustmentSchema,
} from '~/types/schemas/workdayAdjustment';

//******HOOKS*********
const api = useApi();
const toast = useToast();
const router = useRouter();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const typeOptions = [
  {
    label: 'Późniejsze rozpoczęcie pracy',
    value: 'LATE_START',
  },
  {
    label: 'Wcześniejszy koniec pracy',
    value: 'EARLY_END',
  },
];
const date = ref(
  `${new Date().getFullYear()}-${
    new Date().getMonth() < 9
      ? '0' + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1
  }-${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}`
);
const time = ref('');
const state = reactive<Partial<CreateAdjustmentRequest>>({
  date: date.value,
  reason: '',
  time: time.value,
  type: typeOptions[0].value,
});

//******DATE/TIME FORMATTING*********
const { onKeyDown, onDateInput, onTimeInput } = useDateTimeInput(date, time);
watch(date, (newValue) => {
  state.date = newValue;
});
watch(time, (newValue) => {
  state.time = newValue;
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<CreateAdjustmentRequest>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.workdayAdjustment.create({
      date: event.data.date,
      time: event.data.time,
      reason: event.data.reason,
      type: event.data.type,
    });

    toast.add({
      title: `Sukces`,
      description: 'Dostosowanie dnia pracy zostało dodane poprawnie',
      color: 'success',
      duration: 3000,
    });

    router.push('/dashboard/workday-adjustments');
  } catch (e: any) {
    useFetchErrorHandler('Dostosowanie dnia pracy', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">
          Dodawanie dostosowania dnia pracy
        </h1>
      </template>

      <UForm
        :schema="CreateAdjustmentSchema"
        :state
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="Powód (opcjonalnie)" name="reason">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            v-model="state.reason"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
        <UFormField label="Data" name="date">
          <UInput
            v-model="state.date"
            placeholder="YYYY-MM-DD"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            maxlength="10"
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            @input="onDateInput"
            @keydown="onKeyDown"
          />
        </UFormField>
        <UFormField label="Typ" name="type">
          <USelect
            :items="typeOptions"
            v-model="state.type"
            class="w-full bg-zinc-150 dark:bg-zinc-800"
          />
        </UFormField>
        <UFormField
          :label="
            state.type === 'LATE_START'
              ? 'Godzina rozpoczęcia pracy'
              : 'Godzina zakończenia pracy'
          "
          name="time"
        >
          <UInput
            v-model="state.time"
            placeholder="HH:mm"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            maxlength="5"
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            @input="onTimeInput"
            @keydown="onKeyDown"
          />
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading">
            Dodaj dostosowanie dnia pracy
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
