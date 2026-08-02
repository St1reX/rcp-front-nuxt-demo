<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { BreadcrumbItem } from "#ui/types";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { ScheduleXCalendar } from "@schedule-x/vue";
import {
  createCalendar,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewDay,
  type CalendarEventExternal,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { calendarColors } from "~/constants/calendarColors";
import { LeaveTypes, LeaveTypesLabels } from "~/constants/leaveTypes";

//******META*********
definePageMeta({
  layout: "leaves-viewer",
});

//******VARIABLES/STATES*********
const api = useApi();
let calendarApp: any;
let eventsService: ReturnType<typeof createEventsServicePlugin>;
const departments = ref<{ id: string; label: string }[]>([]);
const selectedDepartmentId = ref<string | undefined>(undefined);
const breadcrumbItems: BreadcrumbItem[] = [
  {
    label: "Panel administracyjny",
    to: "/leaves/view",
  },
  {
    label: "Kalendarz urlopów",
    to: "/leaves/view",
  },
];
const currentDate = new Date();
const activeYear = ref(currentDate.getFullYear());
const activeMonth = ref(currentDate.getMonth() + 1);

//******FUNCTIONS*********
const fetchDepartments = async () => {
  try {
    const data = await api.department.getAllDepartments();

    data.departments.forEach((department) => {
      const selectItem = {
        id: department.id,
        label: department.name,
      };
      departments.value.push(selectItem);
    });
  } catch (e: any) {
    useFetchErrorHandler("Oddziały firmy", e);
  }
};
const initCalendar = () => {
  const eventModal = createEventModalPlugin();
  eventsService = createEventsServicePlugin();

  calendarApp = createCalendar({
    views: [createViewMonthGrid(), createViewMonthAgenda(), createViewDay()],
    plugins: [eventModal, eventsService],
    calendars: calendarColors,
    locale: "pl-PL",
    callbacks: {
      onSelectedDateUpdate(date: string) {
        const [y, m] = date.split("-").map(Number);
        activeYear.value = y;
        activeMonth.value = m;
        loadEvents();
      },
    },
  });
};
const loadEvents = async () => {
  const eventList: CalendarEventExternal[] = eventsService.getAll();

  eventList.forEach((event) => {
    eventsService.remove(event.id);
  });

  const data = await api.leave.getAllForMonth({
    year: activeYear.value,
    month: activeMonth.value,
  });

  data.leaves.forEach((leave) => {
    if (
      leave.rejectedAt ||
      !leave.isApproved ||
      (selectedDepartmentId.value &&
        leave.employee.department?.id !== selectedDepartmentId.value)
    ) {
      return;
    }

    eventsService.add({
      id: leave.id,
      title: `Urlop ${leave.employee.firstName} ${leave.employee.lastName}`,
      description: `Typ urlopu: ${
        LeaveTypesLabels[leave.type as LeaveTypes] ?? "Nieznany typ"
      }`,
      start: new Date(leave.startDate).toISOString().slice(0, 10),
      end: new Date(leave.endDate).toISOString().slice(0, 10),
      calendarId: leave.type ?? LeaveTypes.VACATION,
    });
  });
};
watch(selectedDepartmentId, () => {
  loadEvents();
});
onMounted(async () => {
  initCalendar();
  await fetchDepartments();
  await loadEvents();
});
</script>

<template>
  <div class="space-y-6">
    <UBreadcrumb :items="breadcrumbItems">
      <template #separator>
        <span class="mx-2 text-muted">/</span>
      </template>
    </UBreadcrumb>

    <div class="flex justify-between">
      <h1 class="text-2xl font-bold">Kalendarz urlopów</h1>
      <USelect
        placeholder="Oddział firmy"
        v-model="selectedDepartmentId"
        value-key="id"
        :items="departments"
        class="w-48"
      />
    </div>

    <div>
      <ClientOnly>
        <ScheduleXCalendar
          v-if="calendarApp"
          style="height: 1000px"
          :calendar-app="calendarApp"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style>
:root {
  --sx-color-primary: #10b981;
}

.dark {
  --sx-color-primary: #10b981;
}
</style>
