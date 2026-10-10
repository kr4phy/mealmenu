<script setup lang="ts">
import { computed, ref } from 'vue'
import { ALLERGENS, fetchV2MealData, getAllergenConfig, getAllergenName } from '~/lib/apiHandlerV2'
import type { V2Dish, V2MealData } from '~/lib/apiHandlerV2'

const props = defineProps<{ date: string }>()
const mealMenu = ref<V2MealData>({ breakfast: [], lunch: [], dinner: [] })
const selectedAllergens = ref<number[]>([])
const loading = ref(true)

const sections = [
    { key: 'breakfast' as const, label: '아침', icon: 'i-lucide-sunrise', accent: 'bg-amber-50 text-amber-700' },
    { key: 'lunch' as const, label: '점심', icon: 'i-lucide-sun', accent: 'bg-emerald-50 text-emerald-700' },
    { key: 'dinner' as const, label: '저녁', icon: 'i-lucide-moon', accent: 'bg-indigo-50 text-indigo-700' },
]

const loadMenu = async () => {
    loading.value = true
    selectedAllergens.value = getAllergenConfig()
    mealMenu.value = await fetchV2MealData(props.date)
    loading.value = false
}
const warnings = (dish: V2Dish) => dish.allergens.filter((code) => selectedAllergens.value.includes(code))
const label = (code: number) => `${code}. ${getAllergenName(code)}`
const hasPreferences = computed(() => selectedAllergens.value.length > 0)

onMounted(loadMenu)
watch(() => props.date, loadMenu)
</script>

<template>
    <div class="space-y-5">
        <div v-if="hasPreferences" class="flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50/80 p-4 text-sm text-orange-900">
            <UIcon name="i-lucide-shield-alert" class="mt-0.5 size-5 shrink-0" />
            <div><p class="font-semibold">내 알레르기 기준으로 표시 중</p><p class="mt-1 text-orange-800/80">{{ selectedAllergens.map(label).join(', ') }}</p></div>
        </div>
        <div v-if="loading" class="grid gap-4 md:grid-cols-3"><USkeleton v-for="item in 3" :key="item" class="h-64 rounded-3xl" /></div>
        <div v-else class="grid gap-4 md:grid-cols-3">
            <UCard v-for="section in sections" :key="section.key" :ui="{ root: 'rounded-3xl shadow-sm ring-1 ring-gray-200/70', body: 'p-5' }">
                <div class="mb-5 flex items-center justify-between"><div class="flex items-center gap-3"><span :class="['flex size-10 items-center justify-center rounded-2xl', section.accent]"><UIcon :name="section.icon" class="size-5" /></span><h2 class="text-lg font-bold">{{ section.label }}</h2></div><span class="text-xs text-gray-400">{{ mealMenu[section.key].length }}가지</span></div>
                <div v-if="mealMenu[section.key].length" class="space-y-3">
                    <div v-for="(dish, index) in mealMenu[section.key]" :key="`${dish.name}-${index}`" class="rounded-2xl bg-gray-50 px-4 py-3">
                        <div class="flex flex-wrap items-center gap-2"><span class="font-medium text-gray-800">{{ dish.name }}</span><UBadge v-if="dish.allergens.length" color="neutral" variant="subtle" size="xs">{{ dish.allergens.join('.') }}</UBadge></div>
                        <div v-if="warnings(dish).length" class="mt-2 flex items-start gap-1.5 text-xs font-semibold text-red-600"><UIcon name="i-lucide-alert-triangle" class="mt-0.5 size-3.5" />주의: {{ warnings(dish).map(label).join(', ') }}</div>
                    </div>
                </div>
                <p v-else class="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">등록된 메뉴가 없습니다.</p>
            </UCard>
        </div>
        <p class="text-xs text-gray-400">알레르기 번호는 학교 급식 원본 데이터 기준입니다. 알레르기 유무는 조리 환경에 따라 달라질 수 있습니다.</p>
    </div>
</template>
