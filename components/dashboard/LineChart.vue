<script setup lang="ts">
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  Tooltip,
} from 'chart.js';
import type { ChartEvent } from 'chart.js/dist/core/core.plugins';
import { Line } from 'vue-chartjs';

//******HOOKS*********
const router = useRouter();
const colorMode = useColorMode();

//******VARIABLES/STATES*********
const props = defineProps<{
  chartData: any;
}>();
const borderColor = computed(() =>
  colorMode.value === 'dark' ? '#22c55e' : '#15803d'
);
const chartOptions = computed(() => ({
  responsive: true,
  onClick: (event: ChartEvent, elements: any[]) => {
    if (!elements.length) return;

    const pointIndex = elements[0].index;
    const clickedLabel = props.chartData.labels[pointIndex];

    router.push({
      name: 'dashboard-attendance-daily',
      query: { date: clickedLabel },
    });
  },
}));
const lineChartData = computed(() => ({
  labels: props.chartData.labels,
  datasets: [
    {
      label: 'Odczyty',
      data: props.chartData.datasets[0].data,
      borderColor: borderColor.value,
      backgroundColor: borderColor.value,
      pointBackgroundColor: borderColor.value,
      tension: 0.4,
    },
  ],
}));

//******FUNCTIONS*********
ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler,
  Tooltip
);
</script>

<template>
  <Line class="max-h-96" :data="lineChartData" :options="chartOptions" />
</template>
