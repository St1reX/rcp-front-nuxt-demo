<script setup lang="ts">
import type { BreadcrumbItem, FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import { Roles } from '~/constants/roles';
import type { GetDepartmentDetailsResponse } from '~/types/models/department';
import {
  UpdateDepartmentSchema,
  type UpdateDepartmentRequest,
} from '~/types/schemas/department';

//******META*********
definePageMeta({ layout: 'admin' });

//******VARIABLES/STATES*********
const route = useRoute();
const departmentId = route.params.department as string;
const api = useApi();
const isLoading = ref(true);
const editable = ref(false);
const router = useRouter();
const toast = useToast();
const department = ref<GetDepartmentDetailsResponse>();
const leaveRequesters = ref<{ id: string | undefined; label: string }[]>([
  {
    id: undefined,
    label: 'Brak użytkownika',
  },
]);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Oddziały',
    to: '/dashboard/departments',
  },
];
const updateDepartmentState = reactive<UpdateDepartmentRequest>({
  departmentId: departmentId,
  name: '',
  userId: '',
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<UpdateDepartmentRequest>) => {
  event.preventDefault();
  try {
    await api.department.update({
      departmentId: updateDepartmentState.departmentId,
      name: updateDepartmentState.name,
      userId: updateDepartmentState.userId ?? undefined,
    });

    editable.value = false;
    await fetchDepartment();

    toast.add({
      title: 'Sukces',
      description: 'Dane oddziału zostały zaktualizowane poprawnie.',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Oddział firmy', e);
  }
};
const fetchLeavesRequester = async () => {
  try {
    const data = await api.user.getUserByRole({ role: Roles.LEAVES_REQUESTER });

    data.users.forEach((user) => {
      const requester = {
        id: user.id,
        label: user.email,
      };

      if (
        !user.department ||
        user.department.id === updateDepartmentState.departmentId
      ) {
        leaveRequesters.value.push(requester);
      }
    });
  } catch (e: any) {
    useFetchErrorHandler('Konto zbiorowe', e);
  }
};
const fetchDepartment = async (): Promise<void> => {
  try {
    const data = await api.department.getDepartmentDetails({ departmentId });
    department.value = data;
    breadcrumbItems.push({
      label: `${data.name}`,
      to: `/dashboard/departments/${data.id}`,
    });

    updateDepartmentState.name = data.name;
    updateDepartmentState.userId = data.user?.id ?? '';

    isLoading.value = false;
  } catch (e: any) {
    useFetchErrorHandler('Oddział firmy', e);
  }
};
const deleteDepartment = async (): Promise<void> => {
  try {
    await api.department.delete({ departmentId });
    router.push('/dashboard/departments');

    toast.add({
      title: 'Sukces',
      description: 'Oddział został usunięty poprawnie',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Oddział firmy', e);
  }
};
const cancelEdit = () => {
  updateDepartmentState.name = department.value?.name ?? '';
  updateDepartmentState.userId = department.value?.user?.id ?? undefined;

  editable.value = false;
};
onMounted(async () => {
  await fetchDepartment();
  await fetchLeavesRequester();
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
      <h1 class="text-2xl font-bold">Szczegóły oddziału</h1>
      <UModal
        title="Usuwanie oddziału"
        description="Czy napewno chcesz usunąć oddział?"
        :dismissible="false"
      >
        <UButton label="Usuń oddział" color="error" />

        <template #footer>
          <UButton
            label="Usuń czytnik"
            icon="i-heroicons-x-mark"
            color="error"
            @click="deleteDepartment"
          />
        </template>
      </UModal>
    </div>

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold">Dane oddziału</span>
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
        :state="updateDepartmentState"
        @submit="onSubmit"
        class="flex flex-col gap-4"
      >
        <UFormField label="ID" name="readerId">
          <UInput
            v-model="departmentId"
            disabled
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            class="cursor-not-allowed w-full"
          />
        </UFormField>
        <UFormField label="Nazwa" name="name">
          <UInput
            v-model="updateDepartmentState.name"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField label="Mail (konta zbiorowego)" name="departmentId">
          <USelect
            v-model="updateDepartmentState.userId"
            value-key="id"
            :items="leaveRequesters"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField label="Utworzono" name="createdAt">
          <UInput
            :model-value="new Date(department!.createdAt).toLocaleString('pl-PL')"
            disabled
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            class="cursor-not-allowed w-full"
          />
        </UFormField>
        <UFormField label="Zmodyfikowano" name="updatedAt">
          <UInput
            :model-value="new Date(department!.updatedAt).toLocaleString('pl-PL')"
            disabled
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
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
