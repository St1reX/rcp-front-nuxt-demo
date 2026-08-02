<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { AcceptInviteSchema, type AcceptInviteRequest } from '~/types/schemas/auth';
import { FetchError } from 'ofetch';

//******HOOKS*********
const api = useApi();
const toast = useToast();
const route = useRoute();
const router = useRouter();

//******VARIABLES/STATES*********
const showPassword = ref<boolean>(false);
const showRePassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const token = route.query.token as string;
const formState = reactive<Partial<AcceptInviteRequest>>({
  token,
  username: '',
  password: '',
  rePassword: '',
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<AcceptInviteRequest>) => {
  event.preventDefault();
  isLoading.value = true;

  try {
    await api.auth.acceptIntive({
      token: event.data.token,
      username: event.data.username,
      password: event.data.password,
      rePassword: event.data.rePassword,
    });

    toast.add({
      title: 'Sukces',
      description: 'Zaproszenie zostało zaakceptowane pomyślnie',
      color: 'success',
      duration: 3500,
    });

    router.push('/login');
  } catch (e: any) {
    useFetchErrorHandler('Zaproszenie', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Zakładanie konta</h1>
      </template>

      <UForm
        :schema="AcceptInviteSchema"
        :state="formState"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="Nazwa użytkownika" name="username">
          <UInput
            class="w-full"
            v-model="formState.username"
            type="text"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
        <UFormField label="Hasło" name="password">
          <UInput
            class="w-full"
            v-model="formState.password"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :type="showPassword ? 'text' : 'password'"
          >
            <template #trailing>
              <UButton
                variant="ghost"
                color="neutral"
                :trailing-icon="
                  showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                "
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="Powtórz hasło" name="rePassword">
          <UInput
            class="w-full"
            v-model="formState.rePassword"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :type="showRePassword ? 'text' : 'password'"
          >
            <template #trailing>
              <UButton
                variant="ghost"
                color="neutral"
                :trailing-icon="
                  showRePassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                "
                @click="showRePassword = !showRePassword"
              /> </template
          ></UInput>
        </UFormField>

        <p>
          Masz już konto?
          <NuxtLink class="text-green-500" to="/login">Zaloguj się</NuxtLink>
        </p>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading"> Załóż konto </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
