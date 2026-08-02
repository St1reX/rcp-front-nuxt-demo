<script setup lang="ts">
import { FetchError } from 'ofetch';
import type { BreadcrumbItem } from '#ui/types';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
const route = useRoute();
const router = useRouter();
const api = useApi();
const toast = useToast();
const isLoading = ref<boolean>(true);
const inviteId = route.params.invite as string;
const invite = ref<any>(null);
const resentInviteLink = ref('');
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Zaproszenia',
    to: '/dashboard/invites',
  },
  {
    label: `${inviteId}`,
    to: `/dashboard/invites/${inviteId}`,
  },
];

//******FUNCTIONS*********
const deleteInvite = async () => {
  if (invite.value.accepted) {
    toast.add({
      title: 'Nie można usunąć zaproszenia',
      description: 'To zaproszenie zostało już zaakceptowane i nie można go usunąć',
      color: 'error',
      duration: 3000,
    });
    return;
  }
  try {
    await api.auth.removeInvite({
      id: invite.value.id,
    });
    router.push(`/dashboard/invites`);

    toast.add({
      title: 'Sukces',
      description: 'Zaproszenie zostało usunięte poprawnie',
      color: 'success',
      duration: 3000,
    });
  } catch (e: any) {
    useFetchErrorHandler('Zaproszenie', e);
  }
};
const resendInvite = async () => {
  if (invite.value.accepted) {
    toast.add({
      title: 'Nie można usunąć zaproszenia',
      description:
        'To zaproszenie zostało już zaakceptowane i nie można go wysłać ponownie',
      color: 'error',
      duration: 3000,
    });
    return;
  }
  if (new Date() < new Date(invite.value.expiresAt)) {
    toast.add({
      title: 'Nie można wysłać zaproszenia',
      description: 'Poprzednie zaproszenie jeszcze nie wygasło',
      color: 'error',
      duration: 3000,
    });
    return;
  }
  try {
    const result = await api.auth.resendInvite({
      id: invite.value.id,
    });
    resentInviteLink.value = result.inviteLink;

    toast.add({
      title: 'Zaproszenie odnowione',
      description: 'Nowy link aktywacyjny jest dostepny ponizej.',
      color: 'info',
      duration: 3000,
    });

    await fetchInvite();
  } catch (e: any) {
    useFetchErrorHandler('Zaproszenie', e);
  }
};
const fetchInvite = async () => {
  isLoading.value = true;
  try {
    invite.value = await api.auth.getInviteById({ id: inviteId });
  } catch (e: any) {
    useFetchErrorHandler('Zaproszenie', e);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await fetchInvite();
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
      <h1 class="text-2xl font-bold">Zaproszenie dla {{ invite.email }}</h1>
      <div class="flex gap-4">
        <UButton
          label="Wyślij ponownie"
          color="warning"
          @click="resendInvite"
          v-if="!invite.accepted && new Date(invite.expiresAt) < new Date()"
        />
        <UButton
          label="Usuń zaproszenie"
          color="error"
          @click="deleteInvite"
          v-if="!invite.accepted"
        />
      </div>
    </div>

    <UCard class="bg-zinc-100 dark:bg-zinc-800">
      <form class="flex flex-col gap-4">
        <UFormField label="ID" name="id">
          <UInput
            disabled
            v-model="invite.id"
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput
            disabled
            v-model="invite.email"
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
        <UFormField v-if="resentInviteLink" label="Nowy link aktywacyjny demo">
          <UInput :model-value="resentInviteLink" readonly class="w-full" />
        </UFormField>
        <UFormField label="Rola użytkownika" name="role">
          <UInput
            disabled
            :model-value="invite.role.name"
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
          />
        </UFormField>
        <UFormField label="Status" name="status">
          <div class="flex w-full gap-4">
            <UBadge
              variant="subtle"
              :color="
                invite.accepted && invite.acceptedAt
                  ? 'success'
                  : new Date(invite.expiresAt) < new Date()
                  ? 'error'
                  : 'neutral'
              "
              >{{
                invite.accepted && invite.acceptedAt
                  ? 'Zaakceptowane'
                  : new Date(invite.expiresAt) < new Date()
                  ? 'Wygasło'
                  : 'Oczekuje'
              }}</UBadge
            >
            <UInput
              disabled
              class="w-full"
              :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
              :model-value="
                invite.accepted && invite.acceptedAt
                  ? new Date(invite.acceptedAt).toLocaleDateString() +
                    ' ' +
                    new Date(invite.acceptedAt).toLocaleTimeString()
                  : new Date(invite.expiresAt) < new Date()
                  ? new Date(invite.expiresAt).toLocaleDateString() +
                    ' ' +
                    new Date(invite.expiresAt).toLocaleTimeString()
                  : 'Wygasa ' +
                    new Date(invite.expiresAt).toLocaleDateString() +
                    ' ' +
                    new Date(invite.expiresAt).toLocaleTimeString()
              "
            />
          </div>
        </UFormField>
        <UFormField label="Utworzone" name="createdAt">
          <UInput
            disabled
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :model-value="
              new Date(invite.createdAt).toLocaleDateString() +
              ' ' +
              new Date(invite.createdAt).toLocaleTimeString()
            "
          />
        </UFormField>
        <UFormField label="Zmodyfikowane" name="updatedAt">
          <UInput
            disabled
            class="w-full"
            :ui="{ base: 'bg-zinc-100 dark:bg-zinc-950' }"
            :model-value="
              new Date(invite.updatedAt).toLocaleDateString() +
              ' ' +
              new Date(invite.updatedAt).toLocaleTimeString()
            "
          />
        </UFormField>
      </form>
    </UCard>
  </div>
</template>
