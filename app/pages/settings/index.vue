<script setup lang="ts">
import { fetchSchoolDefaultInfo, setConfig } from '~/lib/apiHandler';


const state = reactive({
    atptOfcdcScCode: '',
    sdSchulCode: '',
})

const schoolNameState = reactive({
    cityProvince: '',
    schoolName: '',
})

if(import.meta.client) {
    const config = {
        atptOfcdcScCode: localStorage.getItem('atptOfcdcScCode') || '',
        sdSchulCode: localStorage.getItem('sdSchulCode') || '',
    }
    if(config.atptOfcdcScCode && config.sdSchulCode) {
        state.atptOfcdcScCode = config.atptOfcdcScCode
        state.sdSchulCode = config.sdSchulCode
    }
}

const toast = useToast()
async function onSubmit() {
    toast.add({ title: 'Success', description: 'Settings saved.', color: 'success' })
    setConfig(state.atptOfcdcScCode, state.sdSchulCode)
}

async function handleFindSchool() {
    const schoolInfo = await fetchSchoolDefaultInfo(schoolNameState.cityProvince, schoolNameState.schoolName)
    if (typeof schoolInfo === 'string') {
        if (schoolInfo === "ERR_MULTIPLE_OR_NO_SCHOOLS") {
            toast.add({ title: 'Error', description: 'Multiple or no schools found. Please provide more specific input.', color: 'error' })
        } else if (schoolInfo === "ERR_API_CALL_FAILED") {
            toast.add({ title: 'Error', description: 'Failed to fetch school info. Try again later.', color: 'error' })
        }
    } else if (typeof schoolInfo === 'undefined') {
        toast.add({ title: 'Error', description: 'Error retrieving school information. Try again later.', color: 'error' })
    } else {
        state.atptOfcdcScCode = schoolInfo.ATPT_OFCDC_SC_CODE
        state.sdSchulCode = schoolInfo.SD_SCHUL_CODE
        schoolNameState.cityProvince = schoolInfo.LCTN_SC_NM
        schoolNameState.schoolName = schoolInfo.SCHUL_NM
    }
    open.value = false
}

const open = ref(false)

defineShortcuts({
    f: () => {
        open.value = !open.value
    },
    s: () => {
        onSubmit()
    }
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

                        <div class="flex justify-start gap-12">
                            <UModal
                                v-model:open="open"
                                :close="{
                                    color: 'neutral',
                                    variant: 'outline',
                                    class: 'rounded-full'
                                }"
                            >
                                <UButton color="neutral" variant="subtle">
                                    <!-- <template #label> -->
                                        Find School <UKbd color="neutral" variant="subtle">F</UKbd>
                                    <!-- </template> -->
                                </UButton>

                                <template #title>
                                    Find School
                                </template>

                                <template #description>
                                    Enter the name of your school and the city/province.
                                </template>

                                <template #body>
                                    <UContainer class="my-4">
                                        <UForm :state="schoolNameState" class="space-y-4" @submit="handleFindSchool">
                                            <UFormField label="City/Province" name="cityProvince" required disabled>
                                                <UInput v-model="schoolNameState.cityProvince" />
                                            </UFormField>

                                            <UFormField label="School Name" name="schoolName" required disabled>
                                                <UInput v-model="schoolNameState.schoolName" />
                                            </UFormField>
                                            <UButton type="submit">
                                                Find
                                            </UButton>
                                        </UForm>
                                    </UContainer>
                                </template>
                            </UModal>

                            <UButton type="submit">
                                Save Settings <UKbd color="neutral" variant="outline">S</UKbd>
                            </UButton>
                        </div>

                    </UForm>
                </UContainer>
            </UPageBody>
        </UContainer>
    </UPage>
</template>