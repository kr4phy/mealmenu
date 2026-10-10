<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
const today = new Date()
const { t } = useV2Locale()
const dateValue = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))
const dateLabel = computed(() => `${dateValue.value.year}.${String(dateValue.value.month).padStart(2, '0')}.${String(dateValue.value.day).padStart(2, '0')}`)
const dateKey = computed(() => `${dateValue.value.year}${String(dateValue.value.month).padStart(2, '0')}${String(dateValue.value.day).padStart(2, '0')}`)
</script>
<template>
    <UPage class="v2-page">
        <UContainer>
            <section class="mb-8 flex flex-col justify-between gap-5 pt-8 sm:flex-row sm:items-end">
                <div><p class="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{{ t('heroEyebrow') }}</p><h1 class="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{{ t('heroTitle') }}</h1><p class="mt-2 text-gray-500">{{ dateLabel }} {{ t('heroDescription') }}</p></div>
                <UButton to="/v2/settings" icon="i-lucide-sliders-horizontal" color="neutral" variant="outline" class="w-fit">{{ t('allergySettings') }}</UButton>
            </section>
            <UPageBody class="pt-0">
                <MealMenuTabs :date="dateKey" />
                <section class="mt-10 rounded-3xl bg-gray-900 p-5 text-white shadow-xl sm:p-7"><div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-sm font-medium text-white/60">{{ t('otherDate') }}</p><h2 class="mt-1 text-xl font-bold">{{ t('otherDateTitle') }}</h2></div><div class="flex flex-col gap-3 sm:flex-row sm:items-center"><UInputDate v-model="dateValue" :max-value="undefined" class="bg-white text-gray-900" /><UButton :to="`/v2/selectedMealMenu?date=${dateValue.year}-${dateValue.month}-${dateValue.day}`" color="primary" trailing-icon="i-lucide-arrow-right">{{ t('viewMenu') }}</UButton></div></div></section>
            </UPageBody>
        </UContainer>
    </UPage>
</template>
