<script setup lang="ts">
import { ALLERGENS, fetchSchoolDefaultInfo, getAllergenConfig, setAllergenConfig, setConfig } from '~/lib/apiHandler';

const state = reactive({ atptOfcdcScCode: '', sdSchulCode: '' })
const schoolNameState = reactive({ cityProvince: '', schoolName: '' })
const selectedAllergens = ref<number[]>([])
const allergenSelections = reactive<Record<number, boolean>>({})

if (import.meta.client) {
    state.atptOfcdcScCode = localStorage.getItem('atptOfcdcScCode') || ''
    state.sdSchulCode = localStorage.getItem('sdSchulCode') || ''
    selectedAllergens.value = getAllergenConfig()
    for (const allergen of ALLERGENS) allergenSelections[allergen.code] = selectedAllergens.value.includes(allergen.code)
}

const toast = useToast()
async function onSubmit() {
    selectedAllergens.value = ALLERGENS.filter((allergen) => allergenSelections[allergen.code]).map((allergen) => allergen.code)
    setConfig(state.atptOfcdcScCode, state.sdSchulCode)
    setAllergenConfig(selectedAllergens.value)
    toast.add({ title: 'Success', description: 'Settings saved.', color: 'success' })
}

async function handleFindSchool() {
    const result = await fetchSchoolDefaultInfo(schoolNameState.cityProvince, schoolNameState.schoolName)
    if (typeof result === 'string') {
        toast.add({ title: 'Error', description: result === 'ERR_MULTIPLE_OR_NO_SCHOOLS' ? 'Multiple or no schools found. Please provide more specific input.' : 'Failed to fetch school info. Try again later.', color: 'error' })
        open.value = false
        return
    }
    if (!result) {
        toast.add({ title: 'Error', description: 'Error retrieving school information. Try again later.', color: 'error' })
        open.value = false
        return
    }
    state.atptOfcdcScCode = result.ATPT_OFCDC_SC_CODE
    state.sdSchulCode = result.SD_SCHUL_CODE
    schoolNameState.cityProvince = result.LCTN_SC_NM
    schoolNameState.schoolName = result.SCHUL_NM
    open.value = false
}

const open = ref(false)
function isTypingTarget(target: EventTarget | null): boolean {
    if (!import.meta.client || !(target instanceof HTMLElement)) return false
    return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}
defineShortcuts({
    f: (event: KeyboardEvent) => { if (!isTypingTarget(event.target)) open.value = !open.value },
    s: (event: KeyboardEvent) => { if (!isTypingTarget(event.target)) onSubmit() },
})
</script>

<template>
    <UPage>
        <UContainer>
            <UPageHeader title="Settings" />
            <UPageBody>
                <div>
                    <p>Click the "Find School" button to set your school information.</p>
                    <p>Then type your school's name or city/province. By pressing Find button, other form fields will be automatically filled.</p>
                </div>
                <UContainer>
                    <UForm :state="state" class="space-y-4" @submit="onSubmit">
                        <div class="flex justify-start gap-12">
                            <UFormField label="ATPT_OFCDC_SC_CODE" name="atptOfcdcScCode" required>
                                <UInput v-model="state.atptOfcdcScCode" disabled />
                            </UFormField>
                            <UFormField label="SD_SCHUL_CODE" name="sdSchulCode" required>
                                <UInput v-model="state.sdSchulCode" disabled />
                            </UFormField>
                        </div>

                        <div class="border-t border-default pt-5">
                            <div class="mb-3">
                                <h2 class="font-semibold">Allergy information</h2>
                                <p class="text-sm text-muted">Select foods you need to avoid. Matching items will be highlighted in the meal menu.</p>
                            </div>
                            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                <UCheckbox
                                    v-for="allergen in ALLERGENS"
                                    :key="allergen.code"
                                    v-model="allergenSelections[allergen.code]"
                                    :label="`${allergen.code}. ${allergen.name}`"
                                />
                            </div>
                        </div>

                        <div class="flex justify-start gap-12">
                            <UModal v-model:open="open" :close="{ color: 'neutral', variant: 'outline', class: 'rounded-full' }">
                                <UButton color="neutral" variant="subtle">
                                    Find School <UKbd color="neutral" variant="subtle">F</UKbd>
                                </UButton>
                                <template #title>Find School</template>
                                <template #description>Enter the name of your school and the city/province.</template>
                                <template #body>
                                    <UContainer class="my-4">
                                        <UForm :state="schoolNameState" class="space-y-4" @submit="handleFindSchool">
                                            <UFormField label="City/Province" name="cityProvince" required>
                                                <UInput v-model="schoolNameState.cityProvince" />
                                            </UFormField>
                                            <UFormField label="School Name" name="schoolName" required>
                                                <UInput v-model="schoolNameState.schoolName" />
                                            </UFormField>
                                            <UButton type="submit">Find <UKbd color="neutral" variant="outline">Enter</UKbd></UButton>
                                        </UForm>
                                    </UContainer>
                                </template>
                            </UModal>
                            <UButton type="submit">Save Settings <UKbd color="neutral" variant="outline">S</UKbd></UButton>
                        </div>
                    </UForm>
                </UContainer>
            </UPageBody>
        </UContainer>
    </UPage>
</template>
