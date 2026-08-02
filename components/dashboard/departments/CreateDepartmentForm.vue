<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import {
  CreateDepartmentSchema,
  type CreateDepartmentRequest,
} from '~/types/schemas/department';
import { Roles } from '~/constants/roles';

//******HOOKS*********
const api = useApi();
const toast = useToast();
const router = useRouter();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const leaveRequesters = ref<{ id: string; label: string }[]>([]);
const state = reactive<Partial<CreateDepartmentRequest>>({
  name: '',
  userId: '',
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<CreateDepartmentRequest>) => {
  event?.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.department.create({
      name: state.name as string,
      userId: state.userId || undefined,
    });

    toast.add({
      title: `Sukces`,
      description: 'Oddział firmy został dodany poprawnie',
      color: 'success',
      duration: 3000,
    });

    router.push('/dashboard/departments');
  } catch (e: any) {
    useFetchErrorHandler('Oddział firmy', e);
  } finally {
    isLoading.value = false;
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

      if (!user.department) {
        leaveRequesters.value.push(requester);
      }
    });
  } catch (e: any) {
    useFetchErrorHandler('Konto grupowe', e);
  }
};
onMounted(async () => {
  await fetchLeavesRequester();
});
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Dodawanie oddziału</h1>
      </template>

      <UForm
        :schema="CreateDepartmentSchema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="Nazwa" name="name">
          <UInput
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            v-model="state.name"
            type="text"
          />
        </UFormField>
        <UFormField label="Mail (konta zbiorowego)" name="userId">
          <USelect
            v-model="state.userId"
            value-key="id"
            :items="leaveRequesters"
            placeholder="Brak"
            class="w-full"
          />
        </UFormField>
        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading"> Dodaj oddział </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
