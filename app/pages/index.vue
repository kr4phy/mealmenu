<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
const tabs = [
    {
        label: 'Breakfast',
        icon: '',
        slot: 'breakfast',
    },
    {
        label: 'Lunch',
        icon: '',
        slot: 'lunch',
    },
    {
        label: 'Dinner',
        icon: '',
        slot: 'dinner',
    },
]
const crtDate = new Date()
const maxDate = new CalendarDate(crtDate.getFullYear(), crtDate.getMonth() + 1, crtDate.getDate())
const selectedDate = shallowRef(new CalendarDate(crtDate.getFullYear(), crtDate.getMonth() + 1, crtDate.getDate()))
</script>

<template>
    <UContainer>
        <h1 class='text-2xl font-bold md:text-3xl lg:text-4xl py-8'>Today's Meal Menu</h1>
        <UContainer>
            <UTabs :items="tabs" class="py-8">
                <template #breakfast>
                    <UPageCard title="Breakfast" description="" />
                </template>
                <template #lunch>
                    <UPageCard title="Lunch" description="" />
                </template>
                <template #dinner>
                    <UPageCard title="Dinner" description="" />
                </template>
            </UTabs>
        </UContainer>
        <USeparator />
        <h1 class='text-1xl font-bold md:text-2xl lg:text-3xl py-8'>View specific day's meal menu</h1>
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <UInputDate v-model="selectedDate" :max-value="maxDate" />
            <UButton :to="`/mealmenu?date=${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`" trailing-icon="i-lucide-arrow-right" class="mt-4" color="primary">View Menu</UButton>
        </div>
    </UContainer>
</template>