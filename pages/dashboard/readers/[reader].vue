<script setup lang="ts">
import type { BreadcrumbItem, FormSubmitEvent } from '#ui/types';
import {
  RestartCardReaderSchema,
  UpdateCardReaderSchema,
  type UpdateCardReaderRequest,
} from '~/types/schemas/cardReader';

//******META*********
definePageMeta({ layout: 'admin' });

//******VARIABLES/STATES*********
const route = useRoute();
const readerId = route.params.reader as string;
const api = useApi();
const reader = ref<any>(null);
const isLoading = ref(true);
const isRestarting = ref(false);
const editable = ref(false);
const router = useRouter();
const toast = useToast();
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Czytniki',
    to: '/dashboard/readers',
  },
];
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
const updateReaderState = reactive<UpdateCardReaderRequest>({
  readerId: readerId,
  name: '',
  type: 'ENTRY',
  readerIp: '',
});
const canRestartReader = computed(
  () => RestartCardReaderSchema.safeParse({ readerIp: updateReaderState.readerIp }).success
);

//******FUNCTIONS*********
const fetchReader = async () => {
  try {
    reader.value = await api.cardReader.getById({ readerId });
    breadcrumbItems.splice(2, breadcrumbItems.length - 2, {
      label: `${reader.value.name}`,
      to: `/dashboard/readers/${reader.value.id}`,
    });
    isLoading.value = false;

    updateReaderState.name = reader.value.name;
    updateReaderState.type = reader.value.type;
    updateReaderState.readerIp = reader.value.readerIp || '';
  } catch (e: any) {
    useFetchErrorHandler('Czytnik', e);
  }
};
const deleteReader = async () => {
  try {
    await api.cardReader.delete({ readerId });
    router.push('/dashboard/readers');

    toast.add({
      title: 'Sukces',
      description: 'Czytnik został usunięty poprawnie',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Czytnik', e);
  }
};
const cancelEdit = () => {
  updateReaderState.name = reader.value.name;
  updateReaderState.type = reader.value.type;
  updateReaderState.readerIp = reader.value.readerIp || '';

  editable.value = false;
};
const restartReader = async () => {
  if (!canRestartReader.value) {
    toast.add({
      title: 'Niepoprawny adres IP',
      description: 'Uzupełnij poprawny adres IP czytnika przed restartem.',
      color: 'error',
      duration: 3000,
    });
    return;
  }

  try {
    isRestarting.value = true;
    await api.cardReader.restart({ readerIp: updateReaderState.readerIp });

    toast.add({
      title: 'Sukces',
      description: 'Polecenie restartu czytnika zostało wysłane.',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Czytnik', e);
  } finally {
    isRestarting.value = false;
  }
};
const onSubmit = async (event: FormSubmitEvent<UpdateCardReaderRequest>) => {
  event.preventDefault();
  try {
    await api.cardReader.update({
      readerId: updateReaderState.readerId,
      name: updateReaderState.name,
      type: updateReaderState.type,
      readerIp: updateReaderState.readerIp,
    });

    editable.value = false;

    await fetchReader();

    toast.add({
      title: 'Sukces',
      description: 'Dane czytnika zostały zaktualizowane poprawnie.',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Czytnik', e);
  }
};
onMounted(async () => {
  await fetchReader();
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
      <h1 class="text-2xl font-bold">Szczegóły czytnika</h1>
      <div class="flex gap-2">
        <UModal
          title="Restart czytnika"
          description="Czy na pewno chcesz zrestartować czytnik?"
          :dismissible="false"
        >
          <UButton
            label="Zrestartuj czytnik"
            icon="i-lucide-rotate-cw"
            color="warning"
            :loading="isRestarting"
            :disabled="!canRestartReader"
          />

          <template #footer>
            <UButton
              label="Zrestartuj czytnik"
              icon="i-lucide-rotate-cw"
              color="warning"
              :loading="isRestarting"
              :disabled="!canRestartReader"
              @click="restartReader"
            />
          </template>
        </UModal>
        <UModal
          title="Usuwanie czytnika"
          description="Czy na pewno chcesz usunąć czytnik?"
          :dismissible="false"
        >
          <UButton label="Usuń czytnik" color="error" />

          <template #footer>
            <UButton
              label="Usuń czytnik"
              icon="i-heroicons-x-mark"
              color="error"
              @click="deleteReader"
            />
          </template>
        </UModal>
      </div>
    </div>

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold">Dane czytnika</span>
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
        :schema="UpdateCardReaderSchema"
        :state="updateReaderState"
        @submit="onSubmit"
        class="flex flex-col gap-4"
      >
        <UFormField label="ID" name="readerId">
          <UInput
            v-model="updateReaderState.readerId"
            disabled
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            class="cursor-not-allowed w-full"
          />
        </UFormField>
        <UFormField label="Nazwa" name="name">
          <UInput
            v-model="updateReaderState.name"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField label="Typ" name="type">
          <USelect
            v-model="updateReaderState.type"
            :disabled="!editable"
            value-key="value"
            :items="allowedTypes"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField label="Adres IP" name="readerIp">
          <UInput
            v-model="updateReaderState.readerIp"
            :disabled="!editable"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :class="[{ 'cursor-not-allowed': !editable }, 'w-full']"
          />
        </UFormField>
        <UFormField label="Utworzono" name="createdAt">
          <UInput
            :model-value="new Date(reader.createdAt).toLocaleString('pl-PL')"
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
