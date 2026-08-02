<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';

//******HOOKS*********
const api = useApi();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();
const toast = useToast();

//******VARIABLES/STATES*********
const isLoading = ref<boolean>(false); // MOVE IT INTO Types/schemas
const resetLink = ref('');

const schema = z.object({
  email: z.string().email('Podaj poprawny adres email'),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: '',
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    const response = await api.auth.requestPasswordReset({
      email: event.data.email,
    });
    resetLink.value = response.resetLink || '';

    toast.add({
      title: 'Link resetu utworzony',
      description: 'Link resetu hasla jest dostepny ponizej.',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    if (e instanceof FetchError) {
      if (e.statusCode === 404) {
        toast.add({
          title: 'Sprawdź adres Email',
          description: 'Użytkownik o podanym adresie email nie istnieje',
          color: 'error',
          duration: 3000,
        });

        return;
      }

      if (e.statusCode === 429) {
        toast.add({
          title: 'Email już wysłany',
          description: `Kolejny Email można wysłać za ${Math.floor(
            e.response?._data.retryAfterSeconds / 60
          )}min ${e.response?._data.retryAfterSeconds % 60}s`,
          color: 'info',
          duration: 3000,
        });

        return;
      }
    }
    useFetchErrorHandler('Użytkownik (przypomnienie hasła)', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Prośba o reset hasła</h1>
      </template>

      <UForm :schema :state @submit="onSubmit" class="space-y-4">
        <UFormField label="Email" name="email">
          <UInput class="w-full" v-model="state.email" type="email" />
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading">
            Poproś o reset hasła
          </UButton>
        </div>

        <UFormField v-if="resetLink" label="Link resetu demo">
          <UInput :model-value="resetLink" readonly class="w-full" />
        </UFormField>
      </UForm>
    </UCard>
  </div>
</template>
