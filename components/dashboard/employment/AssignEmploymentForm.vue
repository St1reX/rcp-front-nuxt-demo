<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import {
  AssignEmploymentSchema,
  type AssignEmploymentRequest,
} from '~/types/schemas/employment';
import { FetchError } from 'ofetch';

//******HOOKS*********
const route = useRoute();
const api = useApi();
const toast = useToast();
const router = useRouter();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const query = route.query;
const employeeId = ref<string>(query.employeeId as string);
const employmentTypes = ref<{ id: string; label: string }[]>([]);
const startDate = ref(
  `${new Date().getFullYear()}-${
    new Date().getMonth() < 9
      ? '0' + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1
  }-${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}`
);
const state = reactive<Partial<AssignEmploymentRequest>>({
  employeeId: employeeId.value,
  employmentTypeId: '',
  startDate: startDate.value,
  endDate: null,
});

//******DATE/TIME FORMATTING*********
const { onKeyDown, onDateInput } = useDateTimeInput(startDate);
watch(startDate, (newValue) => {
  state.startDate = newValue;
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<AssignEmploymentRequest>) => {
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.employment.assignToEmployee({
      employeeId: event.data.employeeId,
      employmentTypeId: event.data.employmentTypeId,
      startDate: event.data.startDate,
      endDate: event.data.endDate,
    });

    toast.add({
      title: `Sukces`,
      description: 'Etat został przypisany poprawnie',
      color: 'success',
      duration: 3000,
    });

    router.push(`/dashboard/employees/${employeeId.value}`);
  } catch (e: any) {
    useFetchErrorHandler('Etat pracownika', e);
  } finally {
    isLoading.value = false;
  }
};
const fetchEmloymentTypes = async () => {
  try {
    const data = await api.employment.getAllType();
    data.employmentTypes.forEach((element) => {
      const employment = {
        id: element.id,
        label: element.name,
      };

      employmentTypes.value.push(employment);
    });
  } catch (e: any) {
    useFetchErrorHandler('Etat pracownika', e);
  }
};
onMounted(async () => {
  await fetchEmloymentTypes();
});
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>Przypisywanie etatu dla pracownika</template>

      <UForm
        :schema="AssignEmploymentSchema"
        :state
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
        <UFormField label="Etat" name="employmentTypeId">
          <USelect
            :items="employmentTypes"
            value-key="id"
            v-model="state.employmentTypeId"
            class="w-full bg-zinc-150 dark:bg-zinc-800"
          />
        </UFormField>
        <UFormField label="Data rozpoczęcia" name="startDate">
          <UInput
            v-model="state.startDate"
            placeholder="YYYY-MM-DD"
            maxlength="10"
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            @input="onDateInput"
            @keydown="onKeyDown"
          />
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading"> Przypisz etat </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
