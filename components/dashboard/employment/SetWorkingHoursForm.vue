<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import {
  SetPreferredWorkingHoursSchema,
  type SetPreferredWorkingHoursRequest,
} from '~/types/schemas/employment';

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
const startDate = ref(
  `${new Date().getFullYear()}-${
    new Date().getMonth() < 9
      ? '0' + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1
  }-${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}`
);
const startTime = ref('');
const state = reactive<Partial<SetPreferredWorkingHoursRequest>>({
  employeeId: employeeId,
  startTime: startTime.value,
  startDate: startDate.value,
  endDate: null,
});

//******DATE/TIME FORMATTING*********
const { onKeyDown, onDateInput, onTimeInput } = useDateTimeInput(
  startDate,
  startTime
);
watch(startDate, (newValue) => {
  state.startDate = newValue;
});
watch(startTime, (newValue) => {
  state.startTime = newValue;
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<SetPreferredWorkingHoursRequest>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.employment.setPreferredWorkingHoursForEmployee({
      employeeId: event.data.employeeId,
      startTime: event.data.startTime,
      startDate: event.data.startDate,
      endDate: event.data.endDate,
    });

    toast.add({
      title: `Sukces`,
      description: 'Preferowane godziny pracy zostały przypisane poprawnie',
      color: 'success',
      duration: 3000,
    });

    router.push(`/dashboard/employees/${employeeId}`);
  } catch (e: any) {
    useFetchErrorHandler('Preferowane godziny pracy', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <!-- <UButton @click="onSubmit" label="Test" /> -->
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>Zmiana godzin rozpoczęcia pracy</template>

      <UForm
        :state
        :schema="SetPreferredWorkingHoursSchema"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="ID Pracownika" name="employeeId">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800 cursor-not-allowed"
            v-model="state.employeeId"
            type="text"
            disabled
          />
        </UFormField>
        <UFormField label="Godzina rozpoczęcia pracy" name="startTime">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            v-model="state.startTime"
            @input="onTimeInput"
            @keydown="onKeyDown"
            placeholder="HH:mm"
            maxlength="5"
          />
        </UFormField>
        <UFormField label="Od kiedy zmiana obowiązuje?" name="startDate">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            v-model="state.startDate"
            @input="onDateInput"
            @keydown="onKeyDown"
            placeholder="YYYY-MM-DD"
            maxlength="10"
          />
        </UFormField>
        <UFormField
          label="Do kiedy zmiana obowiązuje?"
          name="endDate"
          style="display: none"
        >
          <UInput v-model="state.endDate" />
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading">
            Zapisz nowe godziny
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
