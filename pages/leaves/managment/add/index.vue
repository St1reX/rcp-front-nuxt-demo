<script setup lang="ts">
import type { BreadcrumbItem, TableColumn } from '#ui/types';
import { FetchError } from 'ofetch';
import {
  LeaveTypes,
  LeaveTypesLabels,
  LeaveTypesValues,
} from '~/constants/leaveTypes';
import { AddLeaveSchema, type AddLeaveRequest } from '~/types/schemas/leave';
import type { FormSubmitEvent } from '#ui/types';
import { format } from 'date-fns';

//******META*********
definePageMeta({
  layout: 'leaves-manager',
});

//******VARIABLES/STATES*********
const api = useApi();
const toast = useToast();
const router = useRouter();
const selectedDates = shallowRef({
  start: undefined,
  end: undefined,
});
const employees = ref<{ value: string; label: string }[]>([]);
const state = reactive<Partial<AddLeaveRequest>>({
  startDate: '',
  endDate: '',
  employeeId: '',
  type: LeaveTypes.VACATION,
  reason: undefined,
});
const isLoading = ref<boolean>(false);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/leaves/managment/',
  },
  {
    label: 'Dodawanie ręczne',
    to: '/leaves/managment/add',
  },
];

//******FUNCTIONS*********
const fetchEmployees = async () => {
  try {
    const data = await api.employee.getAll({});
    data.employees.forEach((employee) => {
      const selectElement = {
        value: employee.id,
        label: `${employee.firstName} ${employee.lastName}`,
      };

      employees.value.push(selectElement);
    });
  } catch (e: any) {
    useFetchErrorHandler('Pracownicy', e);
  }
};
const onSubmit = async (event: FormSubmitEvent<AddLeaveRequest>) => {
  event.preventDefault();

  if (!selectedDates.value.start || !selectedDates.value.end) {
    toast.add({
      title: 'Wymagane daty',
      description: 'Wybierz początkową i końcową datę urlopu',
      color: 'error',
      duration: 5000,
    });
    return;
  }

  state.startDate = format(selectedDates.value.start as Date, 'yyyy-MM-dd');
  state.endDate = format(selectedDates.value.end as Date, 'yyyy-MM-dd');

  const parsed = AddLeaveSchema.safeParse(state);
  if (!parsed.success) {
    toast.add({
      title: 'Podano nieprawidłowe dane',
      description: 'Upewnij się że uzupełniłeś wszystkie pola prawidłowo',
      color: 'error',
      duration: 5000,
    });
    return;
  }

  isLoading.value = true;

  try {
    await api.leave.add({
      startDate: event.data.startDate,
      endDate: event.data.endDate,
      employeeId: event.data.employeeId,
      type: event.data.type,
      reason: event.data.reason,
    });

    router.push(`/leaves/managment`);

    toast.add({
      title: `Sukces`,
      description: 'Urlop został dodany poprawnie',
      color: 'success',
      duration: 5000,
    });
  } catch (e: any) {
    if (e instanceof FetchError) {
      if (e.statusCode === 403) {
        toast.add({
          title: 'Błąd dodawania urlopu dla pracownika',
          description:
            'Użytkownik nie posiada przypisanego etatu co uniemożliwia dodanie urlopu.',
          color: 'error',
          duration: 5000,
        });

        return;
      }

      if (e.statusCode === 409) {
        toast.add({
          title: 'Błąd dodawania urlopu dla pracownika',
          description:
            'Upewnij się że użytkownik nie ma już dodanego urlopu w podanym okresie.',
          color: 'error',
          duration: 5000,
        });

        return;
      }
    }
    useFetchErrorHandler('Urlop', e);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await fetchEmployees();
});
</script>

<template>
  <div class="space-y-6" v-if="!isLoading">
    <UBreadcrumb :items="breadcrumbItems">
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>

    <div class="flex justify-between">
      <h1 class="text-2xl font-bold">Dodaj wniosek</h1>
    </div>
    <div class="flex justify-center items-center w-full">
      <UForm
        :state="state"
        @submit="onSubmit"
        class="flex flex-col gap-6 min-w-1/2 overflow-hidden bg-zinc-50 dark:bg-zinc-800 p-10 rounded-xl shadow animate-fade-in-up"
      >
        <UFormField label="Data urlopu">
          <UCalendar
            v-model="selectedDates"
            class="p-2"
            :week-starts-on="0"
            :number-of-months="1"
            range
          />
        </UFormField>

        <UFormField label="Pracownik" name="employeeId">
          <USelectMenu
            v-model="state.employeeId"
            :search-input="{
              placeholder: 'Znajdź pracownika',
              icon: 'i-lucide-search',
            }"
            value-key="value"
            :items="employees"
            class="w-full"
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
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in 0.6s ease-out, slide-up 0.6s ease-out;
}
</style>
