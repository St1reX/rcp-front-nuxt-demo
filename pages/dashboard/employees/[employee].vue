<script setup lang="ts">
import type { FormSubmitEvent, BreadcrumbItem } from '#ui/types';
import { FetchError } from 'ofetch';
import {
  UpdateEmployeeSchema,
  type UpdateEmployeeRequest,
} from '~/types/schemas/employee';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
const route = useRoute();
const api = useApi();
const router = useRouter();
const toast = useToast();
const employeeId = route.params.employee as string;
const employee = ref<any>(null);
const isLoading = ref(true);
const editable = ref(false);
const departments = ref<{ id: string; label: string }[]>([]);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Pracownicy',
    to: '/dashboard/employees',
  },
];
const updateEmployeeState = reactive<UpdateEmployeeRequest>({
  employeeId: employeeId,
  firstName: '',
  middleName: null,
  lastName: '',
  departmentId: '',
});

//******FUNCTIONS*********
const deleteEmployee = async (): Promise<void> => {
  try {
    await api.employee.delete({ id: employeeId });
    router.push('/dashboard/employees');

    toast.add({
      title: 'Sukces',
      description: 'Pracownik został usunięty poprawnie',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Pracownik', e);
  }
};
const updateEmployee = async (event: FormSubmitEvent<UpdateEmployeeRequest>) => {
  event.preventDefault();

  try {
    await api.employee.update({
      employeeId,
      firstName: event.data.firstName,
      lastName: event.data.lastName,
      middleName: event.data.middleName || null,
      departmentId: event.data.departmentId,
    });
    editable.value = false;

    await fetchEmployee();

    toast.add({
      title: 'Sukces',
      description: 'Dane pracownika zostały zmodyfikowane poprawnie',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Pracownik', e);
  }
};
const fetchEmployee = async () => {
  isLoading.value = true;

  try {
    employee.value = await api.employee.getOne({ id: employeeId });
    updateEmployeeState.firstName = employee.value.firstName;
    updateEmployeeState.lastName = employee.value.lastName;
    updateEmployeeState.middleName = employee.value.middleName;
    updateEmployeeState.departmentId = employee.value.department?.id ?? '';
    if (breadcrumbItems.length < 3) {
      breadcrumbItems.push({
        label: `${employee.value.firstName} ${employee.value.lastName}`,
        to: `/dashboard/employees/${employee.value.id}`,
      });
    }
  } catch (e: any) {
    useFetchErrorHandler('Pracownik', e);
  }

  isLoading.value = false;
};
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
const unassignEmployment = async (employmentId: string): Promise<void> => {
  try {
    await api.employment.unassignFromEmployee({
      employeeId: employeeId,
      employmentTypeId: employmentId,
    });

    await fetchEmployee();

    toast.add({
      title: 'Sukces',
      description: 'Etat zostały usunięty poprawnie.',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Etat', e);
  }
};
const cancelEdit = () => {
  updateEmployeeState.firstName = employee.value.firstName;
  updateEmployeeState.middleName = employee.value.middleName;
  updateEmployeeState.lastName = employee.value.lastName;
  updateEmployeeState.departmentId = employee.value.departmentId;

  editable.value = false;
};
onMounted(async () => {
  await fetchEmployee();
  await fetchDepartments();
});
</script>

<template>
  <div v-if="!isLoading" class="space-y-10">
    <UBreadcrumb :items="breadcrumbItems">
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold">
        Dane pracownika {{ employee.firstName }}
        {{ employee.middleName ? employee.middleName + ' ' : ''
        }}{{ employee.lastName }}
      </h1>
      <div class="flex gap-5 items-center justify-center">
        <UModal
          title="Usuwanie pracownika"
          description="Czy napewno chcesz usunąć pracownika?"
          :dismissible="false"
        >
          <UButton label="Usuń pracownika" color="error" />

          <template #footer>
            <UButton
              label="Usuń pracownika"
              icon="i-heroicons-x-mark"
              color="error"
              @click="deleteEmployee"
            />
          </template>
        </UModal>
      </div>
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
        :state="updateEmployeeState"
        :schema="UpdateEmployeeSchema"
        @submit="updateEmployee"
        class="flex flex-col gap-4"
      >
        <UFormField label="Imię" name="firstName">
          <UInput
            v-model="updateEmployeeState.firstName"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-50 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField label="Drugie imię" name="middleName">
          <UInput
            v-model="updateEmployeeState.middleName"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-50 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField label="Nazwisko" name="lastName">
          <UInput
            v-model="updateEmployeeState.lastName"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-50 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField label="ID" name="id">
          <UInput
            :model-value="employee.id"
            disabled
            :ui="{ base: 'bg-zinc-50 dark:bg-zinc-950' }"
            class="cursor-not-allowed w-full"
          />
        </UFormField>
        <UFormField label="Dział firmy" name="departmentId">
          <USelect
            v-model="updateEmployeeState.departmentId"
            value-key="id"
            :items="departments"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-50 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField label="Data dodania" name="createdAt">
          <UInput
            :model-value="new Date(employee.createdAt).toLocaleString('pl-PL')"
            disabled
            :ui="{ base: 'bg-zinc-50 dark:bg-zinc-950' }"
            class="cursor-not-allowed w-full"
          />
        </UFormField>
        <UFormField label="Ostatnia modyfikacja" name="updatedAt">
          <UInput
            :model-value="new Date(employee.updatedAt).toLocaleString('pl-PL')"
            disabled
            :ui="{ base: 'bg-zinc-50 dark:bg-zinc-950' }"
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

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-md font-bold">Przypisane karty</h2>
          <UButton
            icon="i-heroicons-credit-card"
            :to="`/dashboard/cards/assign?employeeId=${employee.id}`"
            label="Przypisz kartę"
          />
        </div>
      </template>
      <div class="space-y-2 flex flex-col">
        <NuxtLink
          v-for="card in employee.cards"
          :key="card.id"
          :to="`/dashboard/cards/${card.id}`"
          class="text-sm font-mediumw-full p-2 border rounded-md bg-white dark:bg-zinc-900"
        >
          🔑 {{ card.key }}
        </NuxtLink>
      </div>
    </UCard>

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-md font-bold">Urlopy</h2>
          <UButton
            icon="i-heroicons-arrow-left-end-on-rectangle"
            label="Dodaj urlop"
            :to="`/dashboard/leaves/add?employeeId=${employeeId}`"
          />
        </div>
      </template>
      <div class="space-y-2 flex flex-col justify-between">
        <NuxtLink
          v-for="leave in employee.leaves"
          :key="leave.id"
          :to="`/dashboard/leaves/${leave.id}`"
          class="text-sm flex justify-between font-medium w-full p-2 border rounded-md bg-white dark:bg-zinc-900"
        >
          <span>
            📅
            {{ formatDate(leave.startDate) + ' - ' + formatDate(leave.endDate) }}
          </span>
          <UBadge v-if="leave.rejectedAt" size="md" color="error" variant="subtle"
            >Odrzucony</UBadge
          >
          <UBadge
            v-else-if="leave.isApproved === false"
            size="md"
            color="warning"
            variant="subtle"
            >Niezatwierdzony</UBadge
          >
          <UBadge v-else size="md" color="primary" variant="subtle"
            >Zatwierdzony</UBadge
          >
        </NuxtLink>
      </div>
    </UCard>

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-md font-bold">Historia zatrudnienia</h2>
          <UButton
            label="Przypisz nowy etat"
            icon="i-heroicons-calendar"
            :to="`/dashboard/employment/assign?employeeId=${employeeId}`"
          />
        </div>
      </template>
      <div class="space-y-2 flex flex-col">
        <div
          v-for="record in employee.employmentRecords"
          :key="record.id"
          class="text-sm flex justify-between items-center font-mediumw-full p-2 border rounded-md bg-white dark:bg-zinc-900"
        >
          <NuxtLink
            class="grow"
            :to="`/dashboard/employment/${record.employmentType.id}`"
          >
            🧾 {{ record.employmentType.name }} – od
            {{ new Date(record.startDate).toLocaleDateString('pl-PL') }}
            {{
              record.endDate
                ? ' do ' + new Date(record.endDate).toLocaleDateString('pl-PL')
                : 'Bez daty zakończenia'
            }}
          </NuxtLink>
          <div>
            <UModal
              title="Usuwanie etatu"
              :description="`Czy napewno chcesz usunąć etat pracownikowi ${employee.firstName} ${employee.lastName}?`"
              :dismissible="false"
            >
              <UButton
                color="error"
                variant="subtle"
                icon="i-heroicons-x-circle"
                class="cursor-pointer"
              />

              <template #footer>
                <UButton
                  label="Usuń etat"
                  icon="i-heroicons-x-mark"
                  color="error"
                  @click="() => unassignEmployment(record.employmentType.id)"
                />
              </template>
            </UModal>
          </div>
        </div>
      </div>
    </UCard>

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-md font-bold">Preferowane godziny rozpoczęcia pracy</h2>
          <UButton
            label="Przypisz nowe godziny"
            icon="i-heroicons-clock"
            :to="`/dashboard/employment/set-working-hours?employeeId=${employeeId}`"
          />
        </div>
      </template>
      <ul class="space-y-2">
        <li
          v-for="pref in employee.preferredWorkingHours"
          :key="pref.id"
          class="p-2 border rounded-md bg-white dark:bg-zinc-900"
        >
          <div class="text-sm">
            🕒{{ pref.startTime }} - od
            {{ new Date(pref.startDate).toLocaleDateString('pl-PL') }}
            {{
              pref.endDate
                ? ' do ' + new Date(pref.endDate).toLocaleDateString('pl-PL')
                : 'Bez daty zakończenia'
            }}
          </div>
        </li>
      </ul>
    </UCard>
  </div>
</template>
