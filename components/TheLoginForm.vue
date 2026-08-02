<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import { ROUTES } from '@/constants/routes';
import { Roles } from '~/constants/roles';

//******HOOKS*********
const api = useApi();
const router = useRouter();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();
const sessionStore = useSessionStore();
const toast = useToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const isDemoLoading = ref(false);
const showPassword = ref<boolean>(false);

const schema = z.object({
  email: z.string().email('Podaj poprawny adres email'),
  password: z.string().min(8, 'Hasło musi mieć minimum 8 znaków'),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: '',
  password: '',
});

//******FUNCTIONS*********
const redirectByRole = () => {
  if (sessionStore.isInRole(Roles.ADMIN)) {
    router.replace(ROUTES.DASHBOARD_PAGE);
  } else if (sessionStore.isInRole(Roles.LEAVES_REQUESTER)) {
    router.replace(ROUTES.LEAVES_REQUEST_PAGE);
  } else if (sessionStore.isInRole(Roles.LEAVES_MANAGER)) {
    router.replace(ROUTES.LEAVES_MANAGMENT_PAGE);
  } else if (sessionStore.isInRole(Roles.LEAVES_VIEWER)) {
    router.replace(ROUTES.LEAVES_VIEW_PAGE);
  } else {
    router.replace(ROUTES.ROOT_PAGE);
  }
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;
  try {
    const response = await api.auth.login({
      email: event.data.email,
      password: event.data.password,
    });

    sessionStore.session = response?.user;

    redirectByRole();
  } catch (e: any) {
    if (e instanceof FetchError) {
      if (e.statusCode === 401) {
        toast.add({
          title: 'Błąd logowania',
          description: 'Nieprawidłowy email lub hasło',
          color: 'error',
          duration: 3000,
        });

        return;
      }
    }

    toast.add({
      title: e?.statusMessage || 'Błąd połączenia',
      description: e?.data?.message || 'Coś poszło nie tak',
      color: 'error',
      duration: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const loginAsDemoAdmin = async () => {
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isDemoLoading.value = true;
  try {
    const response = await api.auth.demoAdminLogin();
    sessionStore.session = response?.user;
    redirectByRole();
  } catch (e: any) {
    toast.add({
      title: e?.statusMessage || 'Blad logowania demo',
      description: e?.data?.message || 'Nie udalo sie zalogowac jako admin demo',
      color: 'error',
      duration: 3000,
    });
  } finally {
    isDemoLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Logowanie</h1>
      </template>

      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Email" name="email">
          <UInput class="w-full" v-model="state.email" type="email" />
        </UFormField>

        <UFormField label="Hasło" name="password">
          <UInput
            class="w-full"
            v-model="state.password"
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

        <p>
          Nie pamiętasz hasła?
          <NuxtLink class="text-green-500" to="/forgot-password"
            >Zresetuj je</NuxtLink
          >
        </p>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading"> Zaloguj się </UButton>
        </div>

        <UButton
          type="button"
          block
          variant="soft"
          color="neutral"
          :loading="isDemoLoading"
          @click="loginAsDemoAdmin"
        >
          Zaloguj jako admin demo
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
