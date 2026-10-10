<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
const route = useRoute(); const router = useRouter(); const today = new Date()
const { t } = useV2Locale()
const queryDate = route.query.date as string | undefined
const dateValue = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))
if (queryDate) { const [year, month, day] = queryDate.split('-').map(Number); if (year && month && day) dateValue.value = new CalendarDate(year, month, day) }
watch(dateValue, (value) => router.push({ query: { date: `${value.year}-${value.month}-${value.day}` } }))
const dateLabel = computed(() => `${dateValue.value.year}.${String(dateValue.value.month).padStart(2, '0')}.${String(dateValue.value.day).padStart(2, '0')}`)
const dateKey = computed(() => `${dateValue.value.year}${String(dateValue.value.month).padStart(2, '0')}${String(dateValue.value.day).padStart(2, '0')}`)
useHead({ title: `MealMenu · ${dateLabel.value}` })
</script>
<template><UPage><UContainer><section class="pt-8"><p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{{ t('dateMenu') }}</p><h1 class="mt-2 text-3xl font-black tracking-tight text-highlighted">{{ dateLabel }} {{ t('today') }}</h1><UCard class="mt-6"><UCalendar v-model="dateValue" /></UCard></section><UPageBody><MealMenuTabs :date="dateKey" /></UPageBody></UContainer></UPage></template>
