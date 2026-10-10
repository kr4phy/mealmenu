<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
const today = new Date()
const dateValue = shallowRef<any>(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()))
const dateLabel = computed(() => `${dateValue.value.year}.${String(dateValue.value.month).padStart(2, '0')}.${String(dateValue.value.day).padStart(2, '0')}`)
const dateKey = computed(() => `${dateValue.value.year}${String(dateValue.value.month).padStart(2, '0')}${String(dateValue.value.day).padStart(2, '0')}`)
</script>
<template>
    <UPage class="v2-page">
        <UContainer>
            <section class="mb-8 flex flex-col justify-between gap-5 pt-8 sm:flex-row sm:items-end">
                <div><p class="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">MealMenu / V2</p><h1 class="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">오늘 뭐 먹지?</h1><p class="mt-2 text-gray-500">{{ dateLabel }} 급식 메뉴를 한눈에 확인하세요.</p></div>
                <UButton to="/v2/settings" icon="i-lucide-sliders-horizontal" color="neutral" variant="outline" class="w-fit">알레르기 설정</UButton>
            </section>
            <UPageBody class="pt-0">
                <MealMenuTabs :date="dateKey" />
                <section class="mt-10 rounded-3xl bg-gray-900 p-5 text-white shadow-xl sm:p-7"><div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-sm font-medium text-white/60">다른 날짜 보기</p><h2 class="mt-1 text-xl font-bold">원하는 날짜의 메뉴를 찾아보세요</h2></div><div class="flex flex-col gap-3 sm:flex-row sm:items-center"><UInputDate v-model="dateValue" :max-value="undefined" class="bg-white text-gray-900" /><UButton :to="`/v2/selectedMealMenu?date=${dateValue.year}-${dateValue.month}-${dateValue.day}`" color="primary" trailing-icon="i-lucide-arrow-right">메뉴 보기</UButton></div></div></section>
            </UPageBody>
        </UContainer>
    </UPage>
</template>
