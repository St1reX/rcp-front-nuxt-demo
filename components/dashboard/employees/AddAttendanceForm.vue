<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { FetchError } from 'ofetch';
import type { RegisterAttendanceRequest } from '~/types/schemas/attendance';

//******HOOKS*********
const api = useApi();
const toast = useToast();
const router = useRouter();
const route = useRoute();
const errorHandler = useErrorHandler();
const selfClosingToast = useSelfClosingToast();

//******VARIABLES/STATES*********
const isLoading = ref(false);
const cardKey = typeof route.query.cardKey === 'string' ? route.query.cardKey : '';
const firstName =
  typeof route.query.employeeFirstName === 'string'
    ? route.query.employeeFirstName
    : '';
const lastName =
  typeof route.query.employeeLastName === 'string'
    ? route.query.employeeLastName
    : '';
const fullName = `${firstName} ${lastName}`.trim();
const readerOptions = ref<
  {
    id: string;
    label: string;
  }[]
>([]);
const date = ref(
  `${new Date().getFullYear()}-${
    new Date().getMonth() < 9
      ? '0' + (new Date().getMonth() + 1)
      : new Date().getMonth() + 1
  }-${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}`
);
const time = ref('');
const state = reactive<
  Partial<RegisterAttendanceRequest> & { date: string; time: string }
>({
  cardKey: cardKey,
  readerId: undefined,
  dateTimeRead: Date.now(),
  date: date.value,
  time: time.value,
});

//******DATE/TIME FORMATTING*********
const { onKeyDown, onDateInput, onTimeInput } = useDateTimeInput(date, time);
watch(date, (newValue) => {
  state.date = newValue;
});
watch(time, (newValue) => {
  state.time = newValue;
});

//******FUNCTIONS*********

const fetchReaders = async () => {
  try {
    isLoading.value = true;
    const readers = await api.cardReader.list({
      limit: 100,
      offset: 0,
    });

    const entryReader = readers.readers.find((reader) => reader.type === 'ENTRY');
    const exitReader = readers.readers.find((reader) => reader.type === 'EXIT');

    if (!entryReader || !exitReader) {
      toast.add({
        title: 'Wystąpił błąd podczas pobierania czytników',
        description:
          'Musisz mieć co najmniej jeden czytnik wejściowy i wyjściowy aby manipulować obecnością ręcznie',
        color: 'error',
        duration: 5000,
      });
    } else {
      state.readerId = entryReader?.id;
      readerOptions.value.push(
        { id: entryReader.id, label: entryReader.type },
        { id: exitReader.id, label: exitReader.type }
      );
      isLoading.value = false;
    }
  } catch (e: any) {
    useFetchErrorHandler('Czytnik', e);
  }
};

const onSubmit = async (event: FormSubmitEvent<RegisterAttendanceRequest>) => {
  event?.preventDefault();
  selfClosingToast.dismiss();
  errorHandler.clearError();

  isLoading.value = true;

  try {
    state.dateTimeRead = new Date(`${state.date}T${state.time}`).getTime();

    await api.attendance.registerEmployeeAttendance({
      readerId: state.readerId as string,
      cardKey: state.cardKey as string,
      dateTimeRead: state.dateTimeRead,
    });

    toast.add({
      title: `Sukces`,
      description: 'Obecność została dodana prawidłowo',
      color: 'success',
      duration: 3000,
    });

    const employeeId =
      typeof route.query.employeeId === 'string'
        ? route.query.employeeId
        : undefined;
    if (employeeId) {
      router.push(`/dashboard/attendance?employeeId=${employeeId}`);
    } else {
      router.back();
    }
  } catch (e: any) {
    useFetchErrorHandler('Obecność pracownika', e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchReaders();
});
</script>

<template>
  <div class="w-full max-w-sm">
    <UCard class="bg-zinc-150 dark:bg-zinc-750">
      <template #header>
        <h1 class="text-xl font-bold text-center">Dodawanie obecności</h1>
        <h2 class="text-lg font-bold text-center">{{ fullName }}</h2>
      </template>

      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Typ obecności" name="attendanceType">
          <USelect
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            v-model="state.readerId"
            value-key="id"
            :items="readerOptions"
          />
        </UFormField>

        <UFormField
          :label="
            state.readerId === readerOptions[0]?.id ? 'Data wejścia' : 'Data wyjścia'
          "
          name="date"
        >
          <UInput
            v-model="state.date"
            placeholder="YYYY-MM-DD"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            maxlength="10"
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            @input="onDateInput"
            @keydown="onKeyDown"
          />
        </UFormField>

        <UFormField
          :label="
            state.readerId === readerOptions[0]?.id
              ? 'Godzina wejścia'
              : 'Godzina wyjścia'
          "
          name="time"
        >
          <UInput
            v-model="state.time"
            placeholder="HH:mm"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            maxlength="5"
            class="w-full bg-zinc-150 dark:bg-zinc-800"
            @input="onTimeInput"
            @keydown="onKeyDown"
          />
        </UFormField>

        <div class="pt-2">
          <UButton type="submit" block :loading="isLoading">
            Dodaj obecność
          </UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
