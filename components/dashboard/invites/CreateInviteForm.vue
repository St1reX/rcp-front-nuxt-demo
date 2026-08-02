<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import { CreateInviteSchema, type CreateInviteRequest } from '~/types/schemas/auth';

//******HOOKS*********
const api = useApi();
const toast = useToast();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const inviteLink = ref('');
const roles = ref<{ id: string; label: string }[]>([]);
const state = reactive<Partial<CreateInviteRequest>>({
  email: '',
  roleId: '',
});

//******FUNCTIONS*********
const fetchRoles = async () => {
  try {
    const result = await api.roles.getAll();

    roles.value = result.roles.map((role) => ({
      id: role.id,
      label: role.name,
    }));
  } catch (e: any) {
    useFetchErrorHandler('Rola', e);
  }
};

const onSubmit = async (event: FormSubmitEvent<CreateInviteRequest>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    const result = await api.auth.createInvite({
      email: event.data.email,
      roleId: event.data.roleId,
    });
    inviteLink.value = result.inviteLink;

    toast.add({
      title: 'Zaproszenie utworzone',
      description: 'Link aktywacyjny jest dostepny ponizej.',
      color: 'info',
      duration: 5000,
    });

  } catch (e: any) {
    useFetchErrorHandler('Zaproszenie', e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchRoles();
});
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Zaproś użytkownika</h1>
      </template>

      <UForm
        :schema="CreateInviteSchema"
        :state
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput
            type="email"
            v-model="state.email"
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
        <UFormField label="Rola (uprawnienia)" name="departmentId">
          <USelect
            v-model="state.roleId"
            value-key="id"
            :items="roles"
            class="w-full"
          />
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading">
            Wyślij zaproszenie
          </UButton>
        </div>

        <UFormField v-if="inviteLink" label="Link aktywacyjny demo">
          <UInput :model-value="inviteLink" readonly class="w-full" />
        </UFormField>
      </UForm>
    </UCard>
  </div>
</template>
