<script setup lang="ts">
import { computed, ref } from 'vue'
import { fetchV2MealData, getAllergenConfig, getAllergenName } from '~/lib/apiHandlerV2'
import type { V2MealData } from '~/lib/apiHandlerV2'

const props = defineProps<{ date: string }>()
const mealMenu = ref<V2MealData>({ breakfast: [], lunch: [], dinner: [] })
const selectedAllergens = ref<number[]>([])
const loading = ref(true)
const { t, allergenName } = useV2Locale()

const tabs = computed(() => [
    { label: t('breakfast'), icon: 'i-lucide-sunrise', slot: 'breakfast' },
    { label: t('lunch'), icon: 'i-lucide-sun', slot: 'lunch' },
    { label: t('dinner'), icon: 'i-lucide-moon', slot: 'dinner' },
])

const loadMenu = async () => {
    loading.value = true
    selectedAllergens.value = getAllergenConfig()
    mealMenu.value = await fetchV2MealData(props.date)
    loading.value = false
}

const label = (code: number) => `${code}. ${allergenName(code, getAllergenName(code))}`
const menuFor = (key: keyof V2MealData) => mealMenu.value[key]
const allergensFor = (key: keyof V2MealData) => [...new Set(menuFor(key).flatMap((dish) => dish.allergens))].sort((a, b) => a - b)
const isSelected = (code: number) => selectedAllergens.value.includes(code)

onMounted(loadMenu)
watch(() => props.date, () => {
    loadMenu()
    useHead({ title: `MealMenu · ${props.date.slice(0, 4)}. ${props.date.slice(4, 6)}. ${props.date.slice(6, 8)}.` })
})
</script>

<template>
    <div class="space-y-5">
        <USkeleton v-if="loading" class="h-80" />
        <UTabs v-else :items="tabs">
            <template #breakfast>
                <UPageCard :title="t('breakfast')">
                    <div v-if="menuFor('breakfast').length" class="space-y-2">
                        <div v-for="(dish, index) in menuFor('breakfast')" :key="`${dish.name}-${index}`"
                            class="flex flex-wrap items-center gap-2">
                            <span class="text-highlighted">{{ dish.name }}</span>
                            <UBadge v-for="code in dish.allergens" :key="code"
                                :color="isSelected(code) ? 'error' : 'neutral'" variant="subtle" size="xs">{{ code }}
                            </UBadge>
                        </div>
                    </div>
                    <UAlert v-else color="neutral" variant="subtle" :description="t('noMenu')" />
                    <hr class="my-5 border-default" />
                    <div class="space-y-2">
                        <p class="text-sm font-semibold text-highlighted">{{ t('allergenInfo') }}</p>
                        <div v-if="allergensFor('breakfast').length" class="space-y-1">
                            <div v-for="code in allergensFor('breakfast')" :key="code"
                                class="flex items-center gap-2 text-sm"
                                :class="isSelected(code) ? 'text-error font-semibold' : 'text-muted'">
                                <span>{{ label(code) }}</span>
                                <UIcon v-if="isSelected(code)" name="i-lucide-alert-triangle" class="size-4" />
                            </div>
                        </div>
                        <p v-else class="text-sm text-muted">{{ t('noAllergenInfo') }}</p>
                    </div>
                </UPageCard>
            </template>
            <template #lunch>
                <UPageCard :title="t('lunch')">
                    <div v-if="menuFor('lunch').length" class="space-y-2">
                        <div v-for="(dish, index) in menuFor('lunch')" :key="`${dish.name}-${index}`"
                            class="flex flex-wrap items-center gap-2"><span class="text-highlighted">{{ dish.name
                                }}</span>
                            <UBadge v-for="code in dish.allergens" :key="code"
                                :color="isSelected(code) ? 'error' : 'neutral'" variant="subtle" size="xs">{{ code }}
                            </UBadge>
                        </div>
                    </div>
                    <UAlert v-else color="neutral" variant="subtle" :description="t('noMenu')" />
                    <hr class="my-5 border-default" />
                    <div class="space-y-2">
                        <p class="text-sm font-semibold text-highlighted">{{ t('allergenInfo') }}</p>
                        <div v-if="allergensFor('lunch').length" class="space-y-1">
                            <div v-for="code in allergensFor('lunch')" :key="code"
                                class="flex items-center gap-2 text-sm"
                                :class="isSelected(code) ? 'text-error font-semibold' : 'text-muted'">
                                <span>{{ label(code) }}</span>
                                <UIcon v-if="isSelected(code)" name="i-lucide-alert-triangle" class="size-4" />
                            </div>
                        </div>
                        <p v-else class="text-sm text-muted">{{ t('noAllergenInfo') }}</p>
                    </div>
                </UPageCard>
            </template>
            <template #dinner>
                <UPageCard :title="t('dinner')">
                    <div v-if="menuFor('dinner').length" class="space-y-2">
                        <div v-for="(dish, index) in menuFor('dinner')" :key="`${dish.name}-${index}`"
                            class="flex flex-wrap items-center gap-2"><span class="text-highlighted">{{ dish.name
                                }}</span>
                            <UBadge v-for="code in dish.allergens" :key="code"
                                :color="isSelected(code) ? 'error' : 'neutral'" variant="subtle" size="xs">{{ code }}
                            </UBadge>
                        </div>
                    </div>
                    <UAlert v-else color="neutral" variant="subtle" :description="t('noMenu')" />
                    <hr class="my-5 border-default" />
                    <div class="space-y-2">
                        <p class="text-sm font-semibold text-highlighted">{{ t('allergenInfo') }}</p>
                        <div v-if="allergensFor('dinner').length" class="space-y-1">
                            <div v-for="code in allergensFor('dinner')" :key="code"
                                class="flex items-center gap-2 text-sm"
                                :class="isSelected(code) ? 'text-error font-semibold' : 'text-muted'">
                                <span>{{ label(code) }}</span>
                                <UIcon v-if="isSelected(code)" name="i-lucide-alert-triangle" class="size-4" />
                            </div>
                        </div>
                        <p v-else class="text-sm text-muted">{{ t('noAllergenInfo') }}</p>
                    </div>
                </UPageCard>
            </template>
        </UTabs>
        <p class="text-xs text-muted">{{ t('allergyDisclaimer') }}</p>
    </div>
</template>
