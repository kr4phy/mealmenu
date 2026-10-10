<script setup lang="ts">
import { ALLERGENS, getAllergenConfig, setAllergenConfig, getConfig, setConfig, fetchSchoolDefaultInfo } from '~/lib/apiHandlerV2'

const { t, allergenName } = useV2Locale()
const state = reactive({ atptOfcdcScCode: '', sdSchulCode: '' })
const school = reactive({ cityProvince: '', schoolName: '' })
const selected = ref<number[]>([])
const open = ref(false)
const selections = reactive<Record<number, boolean>>({})
const toast = useToast()

onMounted(() => {
    const config = getConfig()
    state.atptOfcdcScCode = config.atptOfcdcScCode
    state.sdSchulCode = config.sdSchulCode
    selected.value = getAllergenConfig()
    ALLERGENS.forEach((item) => selections[item.code] = selected.value.includes(item.code))
})

const save = () => {
    selected.value = ALLERGENS.filter((item) => selections[item.code]).map((item) => item.code)
    setAllergenConfig(selected.value)
    setConfig(state.atptOfcdcScCode, state.sdSchulCode)
    toast.add({ title: t('savedTitle'), description: t('savedDescription'), color: 'success' })
}

const findSchool = async () => {
    const result = await fetchSchoolDefaultInfo(school.cityProvince, school.schoolName)
    if (typeof result === 'string' || !result) {
        toast.add({ title: t('schoolNotFound'), description: t('schoolNotFoundDescription'), color: 'error' })
        return
    }
    state.atptOfcdcScCode = result.ATPT_OFCDC_SC_CODE
    state.sdSchulCode = result.SD_SCHUL_CODE
    school.cityProvince = result.LCTN_SC_NM
    school.schoolName = result.SCHUL_NM
    open.value = false
}
</script>

<template>
    <UPage>
        <UContainer>
            <section class="pt-8"><p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{{ t('personalized') }}</p><h1 class="mt-2 text-3xl font-black tracking-tight text-highlighted">{{ t('personalizedTitle') }}</h1><p class="mt-2 text-muted">{{ t('personalizedDescription') }}</p></section>
            <UPageBody>
                <UCard>
                    <div class="flex flex-col gap-5 sm:flex-row sm:items-end"><UFormField :label="t('educationCode')"><UInput v-model="state.atptOfcdcScCode" disabled /></UFormField><UFormField :label="t('schoolCode')"><UInput v-model="state.sdSchulCode" disabled /></UFormField><UModal v-model:open="open"><UButton color="neutral" variant="outline">{{ t('findSchool') }}</UButton><template #title>{{ t('findSchoolTitle') }}</template><template #body><UForm :state="school" class="space-y-4" @submit="findSchool"><UFormField :label="t('province')"><UInput v-model="school.cityProvince" /></UFormField><UFormField :label="t('schoolName')"><UInput v-model="school.schoolName" /></UFormField><UButton type="submit">{{ t('search') }}</UButton></UForm></template></UModal></div>
                    <USeparator class="my-8" />
                    <div><h2 class="text-lg font-bold text-highlighted">{{ t('allergiesToAvoid') }}</h2><p class="mt-1 text-sm text-muted">{{ t('allergyDescription') }}</p><div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><UCheckbox v-for="item in ALLERGENS" :key="item.code" v-model="selections[item.code]" :label="`${item.code}. ${allergenName(item.code, item.name)}`" /></div></div>
                    <div class="mt-8 flex justify-end"><UButton size="lg" icon="i-lucide-check" @click="save">{{ t('save') }}</UButton></div>
                </UCard>
            </UPageBody>
        </UContainer>
    </UPage>
</template>
