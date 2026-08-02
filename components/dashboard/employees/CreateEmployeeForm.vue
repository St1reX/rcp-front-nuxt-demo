<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import {
  CreateEmployeeSchema,
  type CreateEmployeeRequest,
} from '../../../types/schemas/employee';

//******HOOKS*********
const api = useApi();
const toast = useToast();
const router = useRouter();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const departments = ref<{ id: string; label: string }[]>([]);
const state = reactive<Partial<CreateEmployeeRequest>>({
  firstName: '',
  middleName: null,
  lastName: '',
  departmentId: '',
});

//******FUNCTIONS*********
const fetchDepartments = async () => {
  try {
    const result = await api.department.getAllDepartments();

    departments.value = result.departments.map((dept) => ({
      id: dept.id,
      label: dept.name,
    }));
  } catch (e: any) {
    useFetchErrorHandler('Oddział firmy', e);
  }
};
const onSubmit = async (event: FormSubmitEvent<CreateEmployeeRequest>) => {
  event?.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.employee.create({
      firstName: event.data.firstName.trim(),
      middleName: event.data.middleName ? event.data.middleName.trim() : null,
      lastName: event.data.lastName.trim(),
      departmentId: event.data.departmentId,
    });

    toast.add({
      title: `Sukces`,
      description: 'Pracownik został dodany poprawnie',
      color: 'success',
      duration: 3000,
    });

    router.push('/dashboard/employees');
  } catch (e: any) {
    useFetchErrorHandler('Pracownik', e);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await fetchDepartments();
});
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Dodawanie pracownika</h1>
      </template>

      <UForm
        :schema="CreateEmployeeSchema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="Imię" name="firstName">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            v-model="state.firstName"
            type="text"
          />
        </UFormField>
        <UFormField label="Drugie imię" name="middleName">
          <UInput class="w-full" v-model="state.middleName" type="text" />
        </UFormField>
        <UFormField label="Nazwisko" name="lastName">
          <UInput class="w-full" v-model="state.lastName" type="text" />
        </UFormField>
        <UFormField label="Dział firmy" name="departmentId">
          <USelect
            v-model="state.departmentId"
            value-key="id"
            :items="departments"
            class="w-full"
          />
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading">
            Dodaj pracownika
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
