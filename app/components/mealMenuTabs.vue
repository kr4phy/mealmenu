<script setup lang="ts">
import { ref } from 'vue';
import { getAllergenConfig, getConfig, fetchMealData, allergenName } from '~/lib/apiHandler';
import type { Dish, MealData } from '~/lib/apiHandler';

const tabs = [
    { label: 'Breakfast', icon: '', slot: 'breakfast' },
    { label: 'Lunch', icon: '', slot: 'lunch' },
    { label: 'Dinner', icon: '', slot: 'dinner' },
]

const mealMenu = ref<MealData>({ breakfast: [], lunch: [], dinner: [] })
const selectedAllergens = ref<number[]>([])
const { date } = defineProps<{ date: string }>()

const loadMealMenu = async () => {
    const { atptOfcdcScCode, sdSchulCode } = getConfig()
    selectedAllergens.value = getAllergenConfig()
    mealMenu.value = await fetchMealData(atptOfcdcScCode, sdSchulCode, date)
}

const matchedAllergens = (dish: Dish) => dish.allergens.filter((code) => selectedAllergens.value.includes(code))
const allergenLabel = (code: number) => `${code}. ${allergenName(code)}`

onMounted(async () => await loadMealMenu())
watch(() => date, async () => await loadMealMenu())
</script>

<template>
    <UTabs :items="tabs">
        <template v-for="meal in ['breakfast', 'lunch', 'dinner']" :key="meal" #[meal]>
            <UPageCard :title="meal.charAt(0).toUpperCase() + meal.slice(1)">
                <template #description>
                    <div v-for="(dish, index) in mealMenu[meal as keyof MealData]" :key="index" class="mb-3">
                        <div class="flex flex-wrap items-center gap-2">
                            <span>{{ dish.name }}</span>
                            <UBadge v-if="dish.allergens.length" color="neutral" variant="subtle">
                                알레르기 {{ dish.allergens.join(', ') }}
                            </UBadge>
                            <UBadge v-if="matchedAllergens(dish).length" color="error" variant="subtle">
                                주의: {{ matchedAllergens(dish).map(allergenLabel).join(', ') }}
                            </UBadge>
                        </div>
                    </div>
                    <p v-if="selectedAllergens.length" class="mt-4 text-sm text-muted">
                        설정한 알레르기: {{ selectedAllergens.map(allergenLabel).join(', ') }}
                    </p>
                </template>
            </UPageCard>
        </template>
    </UTabs>
</template>
