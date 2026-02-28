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

const route = useRoute()
const queryDate = route.query.date as string | undefined

const crtDate = new Date()
const dateValue = shallowRef(new CalendarDate(crtDate.getFullYear(), crtDate.getMonth() + 1, crtDate.getDate()))

if (typeof queryDate === 'string') {
    const [year, month, day] = queryDate.split('-').map(Number)
    if (year && month && day) {
        dateValue.value = new CalendarDate(year, month, day)
    }
}

const maxDate = new CalendarDate(dateValue.value.year, dateValue.value.month, dateValue.value.day)

watch(dateValue, (newDate) => {
    const { year, month, day } = newDate
    const newQuery = `?date=${year}-${month}-${day}`
    if (newQuery !== window.location.search) {
        window.history.pushState(null, '', newQuery)
    }
})

</script>

<template>
    <UContainer>
        <h1 class='text-2xl font-bold md:text-3xl lg:text-4xl py-8'>Meal Menu of {{ dateValue }}</h1>
        <UCalendar v-model="dateValue" :max-value="maxDate" />
        <USeparator class="my-8" />
        <UTabs :items="tabs">
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
</template>