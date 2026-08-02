<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import {
  ResetPasswordSchema,
  type ResetPasswordRequest,
} from '~/types/schemas/auth';

//******HOOKS*********
const api = useApi();
const router = useRouter();
const route = useRoute();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();
const toast = useToast();

//******VARIABLES/STATES*********
const token = route.query.token as string;
const isLoading = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const showRePassword = ref<boolean>(false);
const state = reactive<Partial<ResetPasswordRequest>>({
  newPassword: '',
  reNewPassword: '',
  token,
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<ResetPasswordRequest>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.auth.resetPassword({
      newPassword: event.data.newPassword,
      reNewPassword: event.data.reNewPassword,
      token: event.data.token,
    });

    toast.add({
      title: 'Hasło zostało zresetowane',
      description: 'Możesz się teraz zalogować',
      color: 'info',
      duration: 3000,
    });

    router.push('/login');
  } catch (e: any) {
    if (e instanceof FetchError) {
      if (e.statusCode === 400) {
        toast.add({
          title: 'Nie udało się zresetować hasła',
          description: 'Link jest błędny lub wygasł',
          color: 'error',
          duration: 3000,
        });

        return;
      }

      if (e.statusCode === 403) {
        toast.add({
          title: 'Nie udało się zresetować hasła',
          description: 'Nowe hasło nie może być takie samo jak 5 ostatnich',
          color: 'error',
          duration: 3000,
        });

        return;
      }
    }
    useFetchErrorHandler('Użytkownik (reset hasła)', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Resetowanie hasła</h1>
      </template>

      <UForm
        :schema="ResetPasswordSchema"
        :state
        @submit="onSubmit"
        class="spacy-y-4"
      >
        <UFormField label="Nowe hasło" name="newPassword">
          <UInput
            class="w-full"
            v-model="state.newPassword"
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
        <UFormField label="Powtórz hasło" name="reNewPassword">
          <UInput
            class="w-full"
            v-model="state.reNewPassword"
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
              />
            </template>
          </UInput>
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading"> Resetuj hasło </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
