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
    label: 'Pracownicy',
    to: '/dashboard/employees',
  },
  {
    label: `${employeeId}`,
    to: `/dashboard/employees/${employeeId}`,
  },
  {
    label: 'Dodaj urlop',
    to: `/dashboard/leaves/add?employeeId=${employeeId}`,
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
    <DashboardLeavesAddLeaveForm />
  </div>
</template>
