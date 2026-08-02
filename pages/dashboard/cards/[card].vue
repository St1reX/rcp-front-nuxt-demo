<script setup lang="ts">
import type { TableColumn, BreadcrumbItem } from '@nuxt/ui';
import { FetchError } from 'ofetch';

//******META*********
definePageMeta({ layout: 'admin' });

//******VARIABLES/STATES*********
type Card = {
  id: string;
  key: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};
const route = useRoute();
const router = useRouter();
const toast = useToast();
const cardId = route.params.card as string;
const isLoading = ref(true);
const api = useApi();
const card = ref<any>(null);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Karty',
    to: '/dashboard/cards',
  },
];

//******DATA TABLE*********
const columns: TableColumn<Card>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'key',
    header: 'Klucz',
    cell: ({ row }) => row.getValue('key'),
  },
  {
    accessorKey: 'employee',
    header: 'Pracownik',
    cell: ({ row }) => {
      const employee: any = row.getValue('employee');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/employees/${employee.id}`,
          class: 'text-primary underline',
        },
        () => `${employee.firstName} ${employee.lastName}`
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Utworzono',
    cell: ({ row }) => {
      const createdAt: Date = new Date(row.getValue('createdAt'));
      return (
        createdAt.toLocaleDateString('pl-PL') +
        ' ' +
        createdAt.toLocaleTimeString('pl-PL')
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Zmodyfikowano',
    cell: ({ row }) => {
      const updatedAt: Date = new Date(row.getValue('updatedAt'));
      return (
        updatedAt.toLocaleDateString('pl-PL') +
        ' ' +
        updatedAt.toLocaleTimeString('pl-PL')
      );
    },
  },
];

//******FUNCTIONS*********
const deleteCard = async () => {
  try {
    await api.card.deleteCard({ cardId });

    toast.add({
      title: 'Sukces',
      description: 'Karta została usunięty.',
      color: 'primary',
    });

    router.push('/dashboard/cards');
  } catch (e: any) {
    useFetchErrorHandler('Karta pracownicza', e);
  }
};
const fetchCardDetails = async () => {
  try {
    card.value = await api.card.getCardById({ cardId });
    isLoading.value = false;
    breadcrumbItems.push({
      label: `${card.value.key}`,
      to: `/dashboard/card/${card.value.id}`,
    });
  } catch (e: any) {
    useFetchErrorHandler('Karta pracownicza', e);
  }
};
onMounted(async () => {
  await fetchCardDetails();
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
      <h1 class="text-2xl font-bold">Szczegóły karty</h1>
      <UButton
        label="Usuń kartę"
        @click="deleteCard"
        icon="i-heroicons-x-mark"
        color="error"
      />
    </div>

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <UTable
        :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
        :columns
        :data="[card]"
      />
    </UCard>
  </div>
</template>
