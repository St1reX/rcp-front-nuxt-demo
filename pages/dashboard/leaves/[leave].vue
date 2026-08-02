<script setup lang="ts">
import {
  UpdateLeaveAdminSchema,
  type UpdateLeaveAdminRequest,
} from '~/types/schemas/leave';
import type { FormSubmitEvent, BreadcrumbItem } from '#ui/types';
import { FetchError } from 'ofetch';
import type { GetLeaveByIdResponse } from '~/types/models/leave';
import { LeaveStatuses, LeaveStatusesValues } from '~/constants/leaveStatus';
import { LeaveTypes, LeaveTypesValues } from '~/constants/leaveTypes';

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
const editable = ref(false);
const leaveId = route.params.leave as string;
const leave = ref<GetLeaveByIdResponse>();
const leaveStatus = ref<LeaveStatuses>(LeaveStatuses.APPROVED);
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
const state = reactive<UpdateLeaveAdminRequest>({
  leaveId,
  startDate: startDate.value,
  endDate: endDate.value,
  newStatus: LeaveStatuses.APPROVED,
  newType: LeaveTypes.VACATION,
  newReason: undefined,
});
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Pracownicy',
    to: '/dashboard/employees',
  },
  {
    label: 'Urlop',
    to: `/dashboard/leaves/${leaveId}`,
  },
];

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
const fetchLeaveDetails = async () => {
  isLoading.value = true;
  try {
    leave.value = await api.leave.getById({ leaveId });
    leaveStatus.value = leave.value.rejectedAt
      ? LeaveStatuses.DISAPPROVED
      : leave.value.isApproved
      ? LeaveStatuses.APPROVED
      : LeaveStatuses.PENDING;
    breadcrumbItems.splice(2, 0, {
      label: leave.value.employee.firstName + ' ' + leave.value.employee.lastName,
      to: `/dashboard/employees/${leave.value.employee.id}`,
    });

    state.startDate = new Date(leave.value.startDate).toISOString().slice(0, 10);
    state.endDate = new Date(leave.value.endDate).toISOString().slice(0, 10);
    state.newStatus = leaveStatus.value;
    state.newType = leave.value.type as LeaveTypes;
    state.newReason = leave.value.reason ?? undefined;
  } catch (e: any) {
    useFetchErrorHandler('Urlop', e);
  } finally {
    isLoading.value = false;
  }
};
const cancelEdit = () => {
  state.newStatus = leaveStatus.value;
  state.startDate = new Date(leave.value!.startDate).toISOString().slice(0, 10);
  state.endDate = new Date(leave.value!.endDate).toISOString().slice(0, 10);
  state.newType = leave.value?.type as LeaveTypes;
  state.newReason = leave.value?.reason ?? undefined;

  editable.value = false;
};
const onSubmit = async (event: FormSubmitEvent<UpdateLeaveAdminRequest>) => {
  event.preventDefault();

  try {
    await api.leave.updateAdmin({
      startDate: event.data.startDate,
      endDate: event.data.endDate,
      newStatus: event.data.newStatus,
      leaveId: event.data.leaveId,
      newType: event.data.newType,
      newReason: event.data.newReason,
    });
    editable.value = false;

    await fetchLeaveDetails();

    toast.add({
      title: 'Sukces',
      description: 'Dane urlopu zostały zmodyfikowane',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    if (e instanceof FetchError) {
      if (e.statusCode === 409) {
        toast.add({
          title: 'Wystąpił konflikt.',
          description:
            'Wystąpił konflikt. Upewnij się że użytkownik nie ma w podanym okresie innego aktywnego/niezatwierdzonego urlopu oraz ma przypisany etat',
          color: 'error',
          duration: 10000,
        });

        return;
      }
    }
    useFetchErrorHandler('Zaproszenia', e);
  }
};
onMounted(async () => {
  await fetchLeaveDetails();
});
</script>

<template>
  <div class="space-y-6" v-if="!isLoading">
    <UBreadcrumb :items="breadcrumbItems">
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Edycja urlopu</h1>
    </div>

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold">Informacje podstawowe</span>
          <UButton
            icon="i-heroicons-pencil-square"
            @click="editable = !editable"
            color="primary"
          >
            Edytuj dane
          </UButton>
        </div>
      </template>
      <UForm
        :state
        @submit="onSubmit"
        :schema="UpdateLeaveAdminSchema"
        class="flex flex-col gap-4"
      >
        <UFormField label="ID urlopu" name="leaveId">
          <UInput
            v-model="state.leaveId"
            disabled
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            class="cursor-not-allowed w-full"
          />
        </UFormField>
        <UFormField label="Pracownik" name="employee">
          <UInput
            :model-value="leave?.employee.firstName + ' ' + leave?.employee.lastName"
            disabled
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            class="cursor-not-allowed w-full"
          />
        </UFormField>
        <UFormField label="Początek urlopu" name="startDate">
          <UInput
            :model-value="state.startDate"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            class="cursor-not-allowed w-full"
            @input="startDateInput.onDateInput"
            @keydown="startDateInput.onKeyDown"
          />
        </UFormField>
        <UFormField label="Koniec urlopu" name="endDate">
          <UInput
            :model-value="state.endDate"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            class="cursor-not-allowed w-full"
            @input="endDateInput.onDateInput"
            @keydown="endDateInput.onKeyDown"
          />
        </UFormField>
        <UFormField label="Status" name="newStatus">
          <USelect
            v-model="state.newStatus"
            value-key="value"
            :items="LeaveStatusesValues"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-50 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField label="Typ" name="newType">
          <USelect
            v-model="state.newType"
            value-key="value"
            :items="LeaveTypesValues"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-50 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField
          v-if="state.newType === LeaveTypes.BEREAVEMENT"
          label="Powód"
          name="reason"
        >
          <UTextarea
            v-model="state.newReason"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            placeholder="Podaj powód"
            class="cursor-not-allowed w-full"
          />
        </UFormField>
        <template v-if="editable">
          <div class="flex gap-2">
            <UButton
              @click="cancelEdit"
              color="error"
              icon="i-heroicons-x-mark"
              label="Anuluj"
            />
            <UButton
              color="primary"
              icon="i-heroicons-check"
              label="Zapisz zmiany"
              type="submit"
            />
          </div>
        </template>
      </UForm>
    </UCard>
  </div>
</template>
