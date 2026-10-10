<script setup lang="ts">
import MealMenuTabs from '~/components/v2/MealMenuTabs.vue'
import { CalendarDate } from '@internationalized/date'
const today = new Date()
const { t } = useV2Locale()
const dateValue = shallowRef(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))
const dateLabel = computed(() => `${dateValue.value.year}.${String(dateValue.value.month).padStart(2, '0')}.${String(dateValue.value.day).padStart(2, '0')}`)
const dateKey = computed(() => `${dateValue.value.year}${String(dateValue.value.month).padStart(2, '0')}${String(dateValue.value.day).padStart(2, '0')}`)
</script>
<template>
    <UPage>
        <UContainer>
            <section class="mb-8 flex flex-col justify-between gap-5 pt-8 sm:flex-row sm:items-end">
                <div><p class="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{{ t('heroEyebrow') }}</p><h1 class="text-3xl font-black tracking-tight text-highlighted sm:text-4xl">{{ t('heroTitle') }}</h1><p class="mt-2 text-muted">{{ dateLabel }} {{ t('heroDescription') }}</p></div>
                <UButton to="/v2/settings" icon="i-lucide-sliders-horizontal" color="neutral" variant="outline" class="w-fit">{{ t('allergySettings') }}</UButton>
            </section>
            <UPageBody class="pt-0">
                <MealMenuTabs :date="dateKey" />
                <UCard class="mt-10" color="neutral" variant="subtle"><div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-sm font-medium text-muted">{{ t('otherDate') }}</p><h2 class="mt-1 text-xl font-bold text-highlighted">{{ t('otherDateTitle') }}</h2></div><div class="flex flex-col gap-3 sm:flex-row sm:items-center"><UInputDate v-model="dateValue" :max-value="undefined" /><UButton :to="`/v2/selectedMealMenu?date=${dateValue.year}-${dateValue.month}-${dateValue.day}`" color="primary" trailing-icon="i-lucide-arrow-right">{{ t('viewMenu') }}</UButton></div></div></UCard>
            </UPageBody>
        </UContainer>
    </UPage>
</template>
