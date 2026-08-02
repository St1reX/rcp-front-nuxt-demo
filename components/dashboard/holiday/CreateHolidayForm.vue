<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import { type AddHolidayRequest, AddHolidaySchema } from '~/types/schemas/holiday';

//******HOOKS*********
const api = useApi();
const toast = useToast();
const router = useRouter();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const date = ref(
  `${new Date().getFullYear()}-${
    new Date().getMonth() < 9
      ? '0' + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1
  }-${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}`
);
const state = reactive<Partial<AddHolidayRequest>>({
  date: date.value,
  isFixed: false,
  name: '',
});
//******DATE/TIME FORMATTING*********
const { onKeyDown, onDateInput } = useDateTimeInput(date);
watch(date, (newValue) => {
  state.date = newValue;
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<AddHolidayRequest>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.holiday.add({
      date: event.data.date,
      isFixed: event.data.isFixed,
      name: event.data.name,
    });

    toast.add({
      title: `Sukces`,
      description: 'Dzień wolny został dodany poprawnie',
      color: 'success',
      duration: 3000,
    });

    router.push('/dashboard/holidays');
  } catch (e: any) {
    useFetchErrorHandler('Dzień wolny', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Dodawanie dnia wolnego</h1>
      </template>

      <UForm :schema="AddHolidaySchema" :state @submit="onSubmit" class="space-y-4">
        <UFormField label="Nazwa dnia wolnego" name="name">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            v-model="state.name"
            type="text"
          />
        </UFormField>
        <UFormField label="Data" name="date">
          <UInput
            v-model="state.date"
            placeholder="YYYY-MM-DD"
            maxlength="10"
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            @input="onDateInput"
            @keydown="onKeyDown"
          />
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading">
            Dodaj dzień wolny
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
