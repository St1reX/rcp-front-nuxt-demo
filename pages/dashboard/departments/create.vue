<script setup lang="ts">
import type { BreadcrumbItem } from '#ui/types';
import CreateDepartmentForm from '~/components/dashboard/departments/CreateDepartmentForm.vue';

//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: 'Panel administracyjny',
    to: '/dashboard',
  },
  {
    label: 'Oddziały',
    to: '/dashboard/departments',
  },
  {
    label: 'Dodaj',
    to: '/dashboard/departments/create',
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
    <CreateDepartmentForm />
  </div>
</template>
