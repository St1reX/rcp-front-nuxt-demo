<script setup lang="ts">
//******META*********
definePageMeta({
  layout: 'admin',
});

//******VARIABLES/STATES*********
const api = useApi();
const chartDataset = ref();
const employeeCount = ref(0);
const attendanceCount = ref(0);
const activeCardsCount = ref(0);
const daysWithAttendance = ref(0);

//******FUNCTIONS*********
watchEffect(async () => {
  const summary = await api.statistics.getSummary();
  const chartData = await api.statistics.getAttendanceChartData();

  employeeCount.value = summary.employeeCount;
  attendanceCount.value = summary.attendanceCount;
  activeCardsCount.value = summary.activeCardsCount;
  daysWithAttendance.value = summary.daysWithAttendance;

  chartDataset.value = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Odczyty kart',
        data: chartData.data,
        fill: true,
        tension: 0.4,
      },
    ],
  };
});
</script>

<template>
  <div class="space-y-10" v-if="chartDataset">
    <!-- Kafelki statystyk -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        title="Pracownicy"
        :value="employeeCount"
        icon="i-heroicons-users"
      />
      <DashboardStatCard
        title="Odczyty (łącznie)"
        :value="attendanceCount"
        icon="i-heroicons-calendar-days"
      />
      <DashboardStatCard
        title="Aktywne karty"
        :value="activeCardsCount"
        icon="i-heroicons-credit-card"
      />
      <DashboardStatCard
        title="Dni z obecnością"
        :value="daysWithAttendance"
        icon="i-heroicons-calendar"
      />
    </div>

    <!-- Wykres -->
    <UCard class="bg-zinc-50 dark:bg-zinc-800">
      <template #header>
        <h2 class="text-xl font-semibold">Odczyty kart w ostatnich 7 dniach</h2>
      </template>
      <DashboardLineChart :chart-data="chartDataset" />
    </UCard>
  </div>
</template>
