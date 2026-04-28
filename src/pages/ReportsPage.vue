<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Chart from 'primevue/chart';
import { reportApi } from '../services/api';
import type { ReportHerdBySpecies, ReportPropertiesByCity } from '../models/Report';

const reportHerdBySpecies = ref();
const reportPropertyByCity = ref();
const chartPieOptions = ref();
const chartBarOptions = ref();

const loadReportHerdBySpecies = async () => {
  const { data: res } = await reportApi.getTotalHerdsBySpecies();
  const report: ReportHerdBySpecies[] = res.data;

  return {
    labels: report.map((data) => data.species),
    datasets: [
      {
        data: report.map((data) => data.total)
      }
    ]
  }
};

const loadReportPropertyByCity = async () => {
  const { data: res } = await reportApi.getTotalPropertiesByCity();
  const report: ReportPropertiesByCity[] = res.data;
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: report.map((data) => data.city),
    datasets: [
      {
        label: 'Propriedades',
        backgroundColor: documentStyle.getPropertyValue('--p-green-300'),
        data: report.map((data) => data.total)
      }
    ]
  }
};

const setChartPieOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
};

const setChartBarOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}

onMounted(async () => {
  reportHerdBySpecies.value = await loadReportHerdBySpecies();
  reportPropertyByCity.value =  await loadReportPropertyByCity();
  chartPieOptions.value = setChartPieOptions();
  chartBarOptions.value = setChartBarOptions();
})
</script>

<template>
  <section class="max-w-full mx-auto px-4 my-8 sm:px-6 lg:px-8">
    <div class="flex justify-between my-4">
      <h2 class="flex flex-col justify-center text-2xl font-bold text-green-700">Relatórios</h2>
    </div>

    <div class="bg-white rounded-lg shadow-sm flex justify-around gap-8 p-4">
      <div class="card flex justify-center flex-col">
        <h2 class="text-center text-xl mb-2">Animais por espécies</h2>
        <Chart type="pie" :data="reportHerdBySpecies" :options="chartPieOptions" />
      </div>
      <div class="card flex justify-center flex-col">
        <h2 class="text-center text-xl mb-2">Propriedades por municípios</h2>
        <Chart type="bar" :data="reportPropertyByCity" :options="chartBarOptions" class="h-[30rem]" />
      </div>
    </div>
  </section>
</template>