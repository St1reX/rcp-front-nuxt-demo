<script setup lang="ts">
import type { BreadcrumbItem, TableColumn } from "#ui/types";
import { LeaveTypes, LeaveTypesLabels } from "~/constants/leaveTypes";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

//******META*********
definePageMeta({
  layout: "leaves-viewer",
});

//******VARIABLES/STATES*********
type Leaves = {
  id: string;
  startDate: Date;
  endDate: Date;
  employee: { id: string; firstName: string; lastName: string };
  isApproved: boolean;
  createdAt: Date;
  rejectedAt: Date | null;
};
const currentDate = ref(new Date());
const { filterArrayOrdered } = useFilterArray<Leaves>();
const UBadge = resolveComponent("UBadge");
const leaves = ref<Leaves[]>([]);
const filteredLeaves = ref<Leaves[]>([]);
const api = useApi();
const isLoading = ref<boolean>(false);
const searchQuery = ref<string>("");
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: "Panel administracyjny",
    to: "/leaves/view/",
  },
  {
    label: "Wnioski o urlop",
    to: "/leaves/view/requests",
  },
];

//******DATA TABLE*********
const columns: TableColumn<Leaves>[] = [
  {
    accessorKey: "startDate",
    header: "Początek urlopu",
    cell: ({ row }) => {
      return h("span", formatDate(row.getValue("startDate")));
    },
  },
  {
    accessorKey: "endDate",
    header: "Koniec urlopu",
    cell: ({ row }) => {
      return h("span", formatDate(row.getValue("endDate")));
    },
  },
  {
    accessorKey: "employee",
    header: "Pracownik",
    cell: ({ row }) => {
      const employee = row.getValue("employee") as {
        id: string;
        firstName: string;
        lastName: string;
      };
      return h(
        resolveComponent("NuxtLink"),
        {
          to: `#`,
          class: "text-primary underline",
        },
        () => `${employee.firstName + " " + employee.lastName}`
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data złożenia wniosku",
    cell: ({ row }) => {
      return h(
        resolveComponent("NuxtLink"),
        {
          to: `#`,
          class: "text-primary underline",
        },
        () =>
          `${new Date(row.getValue("createdAt")).toLocaleString("pl-PL", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}`
      );
    },
  },
  {
    accessorKey: "isApproved",
    header: "Status",
    cell: ({ row }) => {
      const isApproved = row.getValue("isApproved") as boolean;
      const rejectedAt = row.getValue("rejectedAt") as Date;
      const badgeColor = rejectedAt
        ? "error"
        : isApproved
        ? "success"
        : "warning";
      const badgeContent = rejectedAt
        ? "Odrzucony"
        : isApproved
        ? "Zatwierdzony"
        : "Niezatwierdzony";
      return h(
        UBadge,
        {
          color: badgeColor,
          variant: "subtle",
        },
        () => badgeContent
      );
    },
  },
  {
    accessorKey: "type",
    header: "Typ urlopu",
    cell: ({ row }) => {
      const type = row.getValue("type") as LeaveTypes;
      if (Object.values(LeaveTypes).includes(type)) {
        return h("span", LeaveTypesLabels[type]);
      } else {
        return h("span", "Nieznany typ");
      }
    },
  },
  {
    accessorKey: "rejectedAt",
    header: () => null,
    cell: () => null,
  },
  {
    accessorKey: "id",
    header: () => null,
    cell: () => null,
  },
];

//******FUNCTIONS*********
const setNewDate = async (month: number) => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(month);
  currentDate.value = newDate;

  await loadLeaves(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1
  );

  searchQuery.value = "";
};
watch(searchQuery, () => {
  filterArrayOrdered(
    leaves,
    filteredLeaves,
    ["employee.lastName", "employee.firstName"],
    searchQuery
  );
});
const loadLeaves = async (year: number, month: number) => {
  isLoading.value = true;
  leaves.value = [];

  try {
    const data = await api.leave.getAllForMonth({ year, month });

    leaves.value = [];

    data.leaves.forEach((leave) => {
      leaves.value.push(leave);
    });
    filteredLeaves.value = leaves.value;
  } catch (e: any) {
    useFetchErrorHandler("Urlopy", e);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  await loadLeaves(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1
  );
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
      <h1 class="text-2xl font-bold">Wnioski urlopowe</h1>
      <div class="flex justify-center items-center gap-4">
        <UInput
          icon="i-lucide-search"
          size="md"
          variant="outline"
          placeholder="Wyszukaj pracownika"
          v-model="searchQuery"
        />
      </div>
    </div>

    <div class="flex justify-between items-center">
      <UButton
        icon="i-heroicons-chevron-left"
        @click="setNewDate(currentDate.getMonth() - 1)"
      />
      <p class="text-lg font-medium">
        {{ format(currentDate, "LLLL yyyy", { locale: pl }) }}
      </p>
      <UButton
        icon="i-heroicons-chevron-right"
        @click="setNewDate(currentDate.getMonth() + 1)"
      />
    </div>

    <div class="flex flex-col gap-8 flex-1 w-full">
      <div class="w-full">
        <UCard class="bg-zinc-100 dark:bg-zinc-800">
          <div>
            <UTable
              :ui="{ thead: 'bg-zinc-50 dark:bg-zinc-950' }"
              :data="filteredLeaves"
              :columns="columns"
            />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
