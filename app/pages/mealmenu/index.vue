<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

const route = useRoute()
const router = useRouter()
const queryDate = route.query.date as string | undefined

const crtDate = new Date()
const dateValue = shallowRef(new CalendarDate(crtDate.getFullYear(), crtDate.getMonth() + 1, crtDate.getDate()))

if (typeof queryDate === 'string') {
    const [year, month, day] = queryDate.split('-').map(Number)
    if (year && month && day) {
        dateValue.value = new CalendarDate(year, month, day)
    }
}

const maxDate = new CalendarDate(dateValue.value.year + 1, dateValue.value.month, dateValue.value.day)

watch(dateValue, (newDate) => {
    const { year, month, day } = newDate
    const newQuery = `?date=${year}-${month}-${day}`
    if (newQuery !== window.location.search) {
        router.push({ query: { date: `${year}-${month}-${day}` } })
    }
})

const formattedDate = computed(() => ` ${dateValue.value.year}-${dateValue.value.month.toString().padStart(2, '0')}-${dateValue.value.day.toString().padStart(2, '0')}`)
const pageTitle = computed(() => `Meal Menu of ${formattedDate.value}`)

useHead({
    title: pageTitle.value,
})

</script>

<template>
    <UPage>
        <UContainer>
            <UPageHeader :title="pageTitle" />
            <UPageBody>
                <UCalendar v-model="dateValue" :max-value="maxDate" />
                <USeparator class="my-8" />
                <MealMenuTabs
                    :date="`${dateValue.year}${dateValue.month.toString().padStart(2, '0')}${dateValue.day.toString().padStart(2, '0')}`" />
            </UPageBody>
        </UContainer>
    </UPage>
</template>