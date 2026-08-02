<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import {
  CreateCardReaderSchema,
  type CreateCardReaderRequest,
} from '~/types/schemas/cardReader';

//******HOOKS*********
const api = useApi();
const toast = useToast();
const router = useRouter();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const allowedTypes = ref([
  {
    label: 'Wejściowy',
    value: 'ENTRY',
  },
  {
    label: 'Wyjściowy',
    value: 'EXIT',
  },
  {
    label: 'Obustronny',
    value: 'BOTH',
  },
]);
const state = reactive<Partial<CreateCardReaderRequest>>({
  name: '',
  type: '',
  readerIp: '',
});

//******FUNCTIONS*********
const onSubmit = async (event: FormSubmitEvent<CreateCardReaderRequest>) => {
  event.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    await api.cardReader.create({
      name: event.data.name,
      type: event.data.type,
      readerIp: event.data.readerIp,
    });

    toast.add({
      title: `Sukces`,
      description: 'Czytnik został dodany poprawnie',
      color: 'success',
      duration: 3000,
    });

    router.push('/dashboard/readers');
  } catch (e: any) {
    useFetchErrorHandler('Czytnik', e);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Dodawanie czytnika</h1>
      </template>

      <UForm
        :schema="CreateCardReaderSchema"
        :state
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="Nazwa" name="name">
          <UInput class="w-full" v-model="state.name" type="text" />
        </UFormField>

        <UFormField label="Typ" name="type">
          <USelect class="w-full" v-model="state.type" :items="allowedTypes" />
        </UFormField>

        <UFormField label="Adres IP" name="readerIp">
          <UInput class="w-full" v-model="state.readerIp" type="text" />
        </UFormField>

        <div class="pt-2">
          <UButton label="Dodaj czytnik" block :loading="isLoading" type="submit" />
        </div>
      </UForm>
    </UCard>
  </div>
</template>
