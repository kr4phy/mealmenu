<script setup lang="ts">
import { computed, ref } from 'vue'
import { fetchV2MealData, getAllergenConfig, getAllergenName } from '~/lib/apiHandlerV2'
import type { V2Dish, V2MealData } from '~/lib/apiHandlerV2'

const props = defineProps<{ date: string }>()
const mealMenu = ref<V2MealData>({ breakfast: [], lunch: [], dinner: [] })
const selectedAllergens = ref<number[]>([])
const loading = ref(true)
const { t, allergenName } = useV2Locale()

const sections = computed(() => [
    { key: 'breakfast' as const, label: t('breakfast'), icon: 'i-lucide-sunrise' },
    { key: 'lunch' as const, label: t('lunch'), icon: 'i-lucide-sun' },
    { key: 'dinner' as const, label: t('dinner'), icon: 'i-lucide-moon' },
])

const loadMenu = async () => {
    loading.value = true
    selectedAllergens.value = getAllergenConfig()
    mealMenu.value = await fetchV2MealData(props.date)
    loading.value = false
}
const warnings = (dish: V2Dish) => dish.allergens.filter((code) => selectedAllergens.value.includes(code))
const label = (code: number) => `${code}. ${allergenName(code, getAllergenName(code))}`
const allergensFor = (key: keyof V2MealData) => [...new Set(mealMenu.value[key].flatMap((dish) => dish.allergens))].sort((a, b) => a - b)
const hasPreferences = computed(() => selectedAllergens.value.length > 0)

onMounted(loadMenu)
watch(() => props.date, loadMenu)
</script>

<template>
    <div class="space-y-5">
        <UAlert v-if="hasPreferences" color="warning" variant="subtle" icon="i-lucide-shield-alert" :title="t('myAllergies')" :description="selectedAllergens.map(label).join(', ')" />
        <div v-if="loading" class="grid gap-4 md:grid-cols-3"><USkeleton v-for="item in 3" :key="item" class="h-64" /></div>
        <div v-else class="grid gap-4 md:grid-cols-3">
            <UCard v-for="section in sections" :key="section.key">
                <div class="mb-5 flex items-center justify-between"><div class="flex items-center gap-3"><UBadge color="neutral" variant="subtle" size="lg"><UIcon :name="section.icon" class="size-5" /></UBadge><h2 class="text-lg font-bold text-highlighted">{{ section.label }}</h2></div><span class="text-sm text-muted">{{ mealMenu[section.key].length }} {{ t('items') }}</span></div>
                <div v-if="mealMenu[section.key].length" class="space-y-3">
                    <UCard v-for="(dish, index) in mealMenu[section.key]" :key="`${dish.name}-${index}`" variant="subtle">
                        <div class="flex flex-wrap items-center gap-2"><span class="font-medium text-highlighted">{{ dish.name }}</span><UBadge v-if="dish.allergens.length" color="neutral" variant="subtle" size="xs">{{ dish.allergens.join('.') }}</UBadge></div>
                        <UAlert v-if="warnings(dish).length" class="mt-3" color="error" variant="subtle" icon="i-lucide-alert-triangle" :title="`${t('allergyWarning')}: ${warnings(dish).map(label).join(', ')}`" />
                    </UCard>
                </div>
                <UAlert v-else color="neutral" variant="subtle" :description="t('noMenu')" />
                <hr class="my-5 border-default" />
                <div>
                    <p class="mb-3 text-sm font-semibold text-highlighted">{{ t('allergenInfo') }}</p>
                    <div v-if="allergensFor(section.key).length" class="flex flex-wrap gap-2">
                        <UBadge v-for="code in allergensFor(section.key)" :key="code" :color="selectedAllergens.includes(code) ? 'error' : 'neutral'" variant="subtle">
                            <UIcon v-if="selectedAllergens.includes(code)" name="i-lucide-alert-triangle" class="size-3.5" />
                            {{ label(code) }}
                        </UBadge>
                    </div>
                    <p v-else class="text-sm text-muted">{{ t('noAllergenInfo') }}</p>
                </div>
            </UCard>
        </div>
        <p class="text-xs text-muted">{{ t('allergyDisclaimer') }}</p>
    </div>
</template>
