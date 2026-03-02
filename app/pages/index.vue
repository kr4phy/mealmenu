<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const crtDate = new Date()
const maxDate = new CalendarDate(crtDate.getFullYear() + 1, crtDate.getMonth() + 1, crtDate.getDate())
const selectedDate = shallowRef(new CalendarDate(crtDate.getFullYear(), crtDate.getMonth() + 1, crtDate.getDate()))
</script>

<template>
    <UPage>
        <UContainer>
            <UPageHeader title="Today's Meal Menu" />
            <UPageBody>
                <MealMenuTabs :date="`${crtDate.getFullYear()}${crtDate.getMonth() + 1}${crtDate.getDate()}`" />
                <USeparator class="my-8" />
                <div>
                    <h1 class='text-1xl font-bold md:text-2xl lg:text-3xl py-8'>View specific day's meal menu</h1>
                    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                        <UInputDate v-model="selectedDate" :max-value="maxDate" />
                        <UButton
                            :to="`/mealmenu?date=${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`"
                            trailing-icon="i-lucide-arrow-right"
                            class="mt-4"
                            color="primary"
                        >View Menu</UButton>
                    </div>
                </div>
            </UPageBody>
        </UContainer>
    </UPage>
</template>