<script setup lang="ts">
import { ref } from 'vue';
import { getConfig, fetchMealData } from '~/lib/apiHandler';
import type { MealData } from '~/lib/apiHandler';

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

const mealMenu = ref<MealData>({
    breakfast: [],
    lunch: [],
    dinner: []
})

const { date } = defineProps<{
    date: string
}>()

const loadMealMenu = async () => {
    const { atptOfcdcScCode, sdSchulCode } = getConfig()
    mealMenu.value = await fetchMealData(atptOfcdcScCode, sdSchulCode, date)
}

onMounted(async () => {
    await loadMealMenu()
})

watch(() => date, async () => {
    await loadMealMenu()
})

</script>

<template>
    <UTabs :items="tabs">
        <template #breakfast>
            <UPageCard title="Breakfast">
                <template #description>
                    <div v-for="(dish, index) in mealMenu.breakfast" :key="index" class="mb-2">
                        {{ dish }}
                    </div>
                </template>
            </UPageCard>
        </template>
        <template #lunch>
            <UPageCard title="Lunch">
                <template #description>
                    <div v-for="(dish, index) in mealMenu.lunch" :key="index" class="mb-2">
                        {{ dish }}
                    </div>
                </template>
            </UPageCard>
        </template>
        <template #dinner>
            <UPageCard title="Dinner">
                <template #description>
                    <div v-for="(dish, index) in mealMenu.dinner" :key="index" class="mb-2">
                        {{ dish }}
                    </div>
                </template>
            </UPageCard>
        </template>
    </UTabs>
</template>