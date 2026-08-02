<script setup lang="ts">
import type { BreadcrumbItem } from '#ui/types';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
const route = useRoute();
const employeeId = route.query.employeeId as string;
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Etaty',
    to: '/dashboard/employment',
  },
  {
    label: 'Przypisz do pracownika',
    to: `/dashboard/employment/assign?employeeId=${employeeId}`,
  },
];
</script>

<template>
  <div>
    <UBreadcrumb :items="breadcrumbItems">
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>
  </div>
  <div
    class="flex min-h-11/12 items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4"
  >
    <DashboardEmploymentAssignEmploymentForm />
  </div>
</template>
