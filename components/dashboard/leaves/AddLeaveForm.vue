<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import {
  AddLeaveSchema,
  RequestForLeaveSchema,
  type AddLeaveRequest,
  type RequestForLeaveRequest,
} from '~/types/schemas/leave';
import { LeaveTypesValues, LeaveTypes } from '~/constants/leaveTypes';

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
const endDate = ref(
  `${new Date().getFullYear()}-${
    new Date().getMonth() < 9
      ? '0' + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1
  }-${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}`
);
const state = reactive<Partial<AddLeaveRequest>>({
  startDate: startDate.value,
  endDate: endDate.value,
  employeeId: employeeId,
  type: LeaveTypes.VACATION,
  reason: undefined,
});

//******DATE/TIME FORMATTING*********
const startDateInput = useDateTimeInput(startDate);
const endDateInput = useDateTimeInput(endDate);

watch(startDate, (newValue) => {
  state.startDate = newValue;
});

watch(endDate, (newValue) => {
  state.endDate = newValue;
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<AddLeaveRequest>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.leave.add({
      startDate: event.data.startDate,
      endDate: event.data.endDate,
      employeeId: event.data.employeeId,
      type: event.data.type,
      reason: event.data.reason,
    });

    toast.add({
      title: `Sukces`,
      description: 'Urlop został dodany poprawnie',
      color: 'success',
      duration: 3000,
    });

    router.push(`/dashboard/employees/${employeeId}`);
  } catch (e: any) {
    if (e instanceof FetchError) {
      if (e.statusCode === 403) {
        toast.add({
          title: 'Błąd dodawania urlopu dla pracownika',
          description:
            'Użytkownik nie posiada przypisanego etatu co uniemożliwia dodanie urlopu.',
          color: 'error',
          duration: 3000,
        });

        return;
      }

      if (e.statusCode === 409) {
        toast.add({
          title: 'Błąd dodawania urlopu dla pracownika',
          description:
            'Upewnij się że użytkownik nie ma już dodanego urlopu w podanym okresie.',
          color: 'error',
          duration: 3000,
        });

        return;
      }
    }
    useFetchErrorHandler('Urlop', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>Dodawanie urlopu</template>

      <UForm :schema="AddLeaveSchema" :state @submit="onSubmit" class="space-y-4">
        <UFormField label="ID pracownika" name="employeeId">
          <UInput
            class="w-full cursor-not-allowed bg-zinc-150 dark:bg-zinc-800"
            disabled
            v-model="state.employeeId"
            type="text"
          />
        </UFormField>
        <UFormField label="Rozpoczęcie urlopu" name="startDate">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            v-model="startDate"
            type="text"
            @input="startDateInput.onDateInput"
            @keydown="startDateInput.onKeyDown"
          />
        </UFormField>
        <UFormField label="Zakończenie urlopu" name="endDate">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            type="text"
            v-model="endDate"
            @input="endDateInput.onDateInput"
            @keydown="endDateInput.onKeyDown"
          />
        </UFormField>
        <UFormField label="Typ" name="newType">
          <USelect
            v-model="state.type"
            value-key="value"
            :items="LeaveTypesValues"
            class="w-full"
          />
        </UFormField>
        <UFormField
          v-if="state.type === LeaveTypes.BEREAVEMENT"
          label="Powód"
          name="reason"
        >
          <UTextarea
            v-model="state.reason"
            placeholder="Podaj powód"
            class="cursor-not-allowed w-full"
          />
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading"> Dodaj urlop </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
