<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
const route = useRoute(); const router = useRouter(); const today = new Date()
const queryDate = route.query.date as string | undefined
const dateValue = shallowRef<any>(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))
if (queryDate) { const [year, month, day] = queryDate.split('-').map(Number); if (year && month && day) dateValue.value = new CalendarDate(year, month, day) }
watch(dateValue, (value) => router.push({ query: { date: `${value.year}-${value.month}-${value.day}` } }))
const dateLabel = computed(() => `${dateValue.value.year}.${String(dateValue.value.month).padStart(2, '0')}.${String(dateValue.value.day).padStart(2, '0')}`)
const dateKey = computed(() => `${dateValue.value.year}${String(dateValue.value.month).padStart(2, '0')}${String(dateValue.value.day).padStart(2, '0')}`)
useHead({ title: `MealMenu · ${dateLabel.value}` })
</script>
<template><UPage class="v2-page"><UContainer><section class="pt-8"><p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary">날짜별 메뉴</p><h1 class="mt-2 text-3xl font-black tracking-tight">{{ dateLabel }} 급식</h1><div class="mt-6 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200/70"><UCalendar v-model="dateValue" /></div></section><UPageBody><MealMenuTabs :date="dateKey" /></UPageBody></UContainer></UPage></template>
