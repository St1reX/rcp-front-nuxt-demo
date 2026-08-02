<script setup lang="ts">
import type { TableColumn, BreadcrumbItem } from '#ui/types';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
type Invite = {
  id: string;
  accepted: boolean;
  acceptedAt: Date | null;
  email: string;
  role: {
    id: string;
    name: string;
  };
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
const api = useApi();
const invites = ref<any[]>([]);
const isLoading = ref(true);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Zaproszenia',
    to: '/dashboard/invites',
  },
];

//******DATA TABLE*********
const columns: TableColumn<Invite>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      const id = row.getValue('id');
      return h(
        resolveComponent('NuxtLink'),
        {
          to: `/dashboard/invites/${id}`,
          class: 'underline text-primary',
        },
        () => `#${id}`
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email');
      return email;
    },
  },
  {
    // accessorKey: "accepted",
    accessorKey: 'id',
    header: 'Status',
    cell: ({ row }) => {
      const id = row.getValue('id');
      const accepted = invites.value.find((invite) => invite.id === id).accepted;
      const acceptedAtRaw: Date | null = invites.value.find(
        (invite) => invite.id === id
      ).acceptedAt;
      const expiresAtRaw: Date = invites.value.find(
        (invite) => invite.id === id
      ).expiresAt;
      if (accepted && acceptedAtRaw) {
        const acceptedAt: Date = new Date(acceptedAtRaw);
        return h(
          resolveComponent('UBadge'),
          {
            color: 'success',
            variant: 'subtle',
          },
          () =>
            `Zaakceptowane: ${acceptedAt.toLocaleDateString()} ${acceptedAt.toLocaleTimeString()}`
        );
      }
      const expiresAt: Date = new Date(expiresAtRaw);
      if (new Date() > expiresAt) {
        return h(
          resolveComponent('UBadge'),
          {
            color: 'error',
            variant: 'subtle',
          },
          () => `Wygasło`
        );
      }
      return h(
        resolveComponent('UBadge'),
        {
          color: 'neutral',
          variant: 'subtle',
        },
        () =>
          `Oczekuje do: ${expiresAt.toLocaleDateString()} ${expiresAt.toLocaleTimeString()}`
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Rola użytkownika',
    cell: ({ row }) => {
      const role = row.getValue('role') as { id: string; name: string };
      return role.name;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Utworzone',
    cell: ({ row }) => {
      const createdAt: Date = new Date(row.getValue('createdAt'));
      return `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Zaktualizowano',
    cell: ({ row }) => {
      const updatedAt: Date = new Date(row.getValue('updatedAt'));
      return `${updatedAt.toLocaleDateString()} ${updatedAt.toLocaleTimeString()}`;
    },
  },
];

//******FUNCTIONS*********
const fetchInvites = async () => {
  isLoading.value = true;
  try {
    invites.value = await api.auth.listInvites();
  } catch (e: any) {
    useFetchErrorHandler('Zaproszenia', e);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await fetchInvites();
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
      <h1 class="text-2xl font-bold">Zaproszenia</h1>
      <UButton
        icon="i-lucide-mail-plus"
        label="Zaproś użytkownika"
        color="success"
        to="/dashboard/invites/create"
      />
    </div>

    <div class="flex flex-col space-y-8 flex-1 w-full">
      <UCard class="bg-zinc-100 dark:bg-zinc-800">
        <UTable
          :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
          :data="invites"
          :columns
        />
      </UCard>
    </div>
  </div>
</template>
