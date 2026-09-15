// Define types for API response
type MealInfo = {
    "ATPT_OFCDC_SC_CODE": string,
    "ATPT_OFCDC_SC_NM": string,
    "SD_SCHUL_CODE": string,
    "SCHUL_NM": string,
    "MMEAL_SC_CODE": string,
    "MMEAL_SC_NM": string,
    "MLSV_YMD": string,
    "MLSV_FGR": number,
    "DDISH_NM": string,
    "ORPLC_INFO": string,
    "CAL_INFO": string,
    "NTR_INFO": string,
    "MLSV_FROM_YMD": string,
    "MLSV_TO_YMD": string,
    "LOAD_DTM": string
}

type MealMenuAPIDataSuccess = {
    "mealServiceDietInfo": [
        { "head": [{ "list_total_count": number }, { "RESULT": { "CODE": string, "MESSAGE": string } }] },
        { "row": MealInfo[] }
    ]
}

type SchoolInfo = {
    "ATPT_OFCDC_SC_CODE": string,
    "ATPT_OFCDC_SC_NM": string,
    "SD_SCHUL_CODE": string,
    "SCHUL_NM": string,
    "ENG_SCHUL_NM": null | string,
    "SCHUL_KND_SC_NM": string,
    "LCTN_SC_NM": string,
    "JU_ORG_NM": string,
    "FOND_SC_NM": string,
    "ORG_RDNZC": string,
    "ORG_RDNMA": string,
    "ORG_RDNDA": string,
    "ORG_TELNO": string,
    "HMPG_ADRES": string,
    "COEDU_SC_NM": string,
    "ORG_FAXNO": string,
    "HS_SC_NM": string,
    "INDST_SPECL_CCCCL_EXST_YN": string,
    "HS_GNRL_BUSNS_SC_NM": string,
    "SPCLY_PURPS_HS_ORD_NM": null | string,
    "ENE_BFE_SEHF_SC_NM": string,
    "DGHT_SC_NM": string,
    "FOND_YMD": string,
    "FOAS_MEMRD": string,
    "LOAD_DTM": string
}

type SchoolInfoAPIDataSuccess = {
    "schoolInfo": [{ "head": [{ "list_total_count": number }, { "RESULT": { "CODE": string, "MESSAGE": string } }] }, { "row": SchoolInfo[] }]
}

type APIDataFailure = { "RESULT": { "CODE": string, "MESSAGE": string } }
type APIResponse = MealMenuAPIDataSuccess | APIDataFailure

export type Dish = {
    name: string
    allergens: number[]
}

export type MealData = {
    breakfast: Dish[],
    lunch: Dish[],
    dinner: Dish[],
}

export const ALLERGENS = [
    { code: 1, name: '난류(계란)' },
    { code: 2, name: '우유' },
    { code: 3, name: '메밀' },
    { code: 4, name: '땅콩' },
    { code: 5, name: '대두' },
    { code: 6, name: '밀' },
    { code: 7, name: '고등어' },
    { code: 8, name: '게' },
    { code: 9, name: '새우' },
    { code: 10, name: '돼지고기' },
    { code: 11, name: '복숭아' },
    { code: 12, name: '토마토' },
    { code: 13, name: '아황산류' },
    { code: 14, name: '호두' },
    { code: 15, name: '닭고기' },
    { code: 16, name: '쇠고기' },
    { code: 17, name: '오징어' },
    { code: 18, name: '조개류(굴·전복·홍합 포함)' },
    { code: 19, name: '잣' },
] as const

export function getConfig() {
    const runtimeConfig = useRuntimeConfig()
    let atptOfcdcScCode = runtimeConfig.public.atptOfcdcScCode as string
    let sdSchulCode = runtimeConfig.public.sdSchulCode as string

    if (import.meta.client) {
        const localAtptOfcdcScCode = localStorage.getItem('atptOfcdcScCode') || ''
        const localSdSchulCode = localStorage.getItem('sdSchulCode') || ''
        if (localAtptOfcdcScCode && localSdSchulCode) {
            atptOfcdcScCode = localAtptOfcdcScCode
            sdSchulCode = localSdSchulCode
        }
    }

    return { atptOfcdcScCode, sdSchulCode }
}

export function setConfig(atptOfcdcScCodeValue: string, sdSchulCodeValue: string) {
    if (import.meta.client) {
        localStorage.setItem('atptOfcdcScCode', atptOfcdcScCodeValue)
        localStorage.setItem('sdSchulCode', sdSchulCodeValue)
    }
}

export function getAllergenConfig(): number[] {
    if (!import.meta.client) return []
    try {
        const value = JSON.parse(localStorage.getItem('allergens') || '[]')
        return Array.isArray(value) ? value.map(Number).filter((code) => Number.isInteger(code) && code >= 1 && code <= 19) : []
    } catch {
        return []
    }
}

export function setAllergenConfig(codes: number[]) {
    if (import.meta.client) localStorage.setItem('allergens', JSON.stringify(codes))
}

// NEIS marks allergens in parentheses, e.g. 김치찌개(5.6.9.13). Preserve those codes for the UI.
export function parseDDISH_NM(ddishNmRaw: string): Dish[] {
    return ddishNmRaw
        .split('<br/>')
        .map((rawDish): Dish => {
            const match = rawDish.match(/\(([^()]*)\)\s*$/)
            const allergens = (match?.[1] || '').split(/[.,]/).map(Number).filter((code) => Number.isInteger(code) && code >= 1 && code <= 19)
            const name = rawDish.replace(/\s*\([^()]*\)\s*$/, '').trim()
            return { name: name || rawDish.trim(), allergens }
        })
        .filter((dish) => Boolean(dish.name))
}

export async function fetchMealData(atptOfcdcScCode: string, sdSchulCode: string, date: string): Promise<MealData> {
    const mealData: MealData = {
        breakfast: [{ name: 'Breakfast is not provided this day.', allergens: [] }],
        lunch: [{ name: 'Lunch is not provided this day.', allergens: [] }],
        dinner: [{ name: 'Dinner is not provided this day.', allergens: [] }]
    }
    try {
        const apidata = await $fetch<APIResponse>('https://open.neis.go.kr/hub/mealServiceDietInfo', {
            query: { ATPT_OFCDC_SC_CODE: atptOfcdcScCode, SD_SCHUL_CODE: sdSchulCode, MLSV_YMD: date, TYPE: 'json' }
        })

        if ('mealServiceDietInfo' in apidata) {
            const mealInfo = apidata.mealServiceDietInfo?.[1]?.row
            if (!Array.isArray(mealInfo)) return mealData
            for (const info of mealInfo) {
                const dishes = parseDDISH_NM(info.DDISH_NM)
                if (info.MMEAL_SC_CODE === '1') mealData.breakfast = dishes
                if (info.MMEAL_SC_CODE === '2') mealData.lunch = dishes
                if (info.MMEAL_SC_CODE === '3') mealData.dinner = dishes
            }
        } else {
            mealData.breakfast = [{ name: 'There is no meal information available.', allergens: [] }]
            mealData.lunch = [{ name: 'There is no meal information available.', allergens: [] }]
            mealData.dinner = [{ name: 'There is no meal information available.', allergens: [] }]
        }
    } catch (error) {
        console.error('Error fetching meal data:', error)
        mealData.breakfast = [{ name: 'Failed to fetch meal information.', allergens: [] }]
        mealData.lunch = [{ name: 'Failed to fetch meal information.', allergens: [] }]
        mealData.dinner = [{ name: 'Failed to fetch meal information.', allergens: [] }]
    }
    return mealData
}

export async function fetchSchoolDefaultInfo(lctnScNm: string, schulNm: string) {
    try {
        const apidata = await $fetch<SchoolInfoAPIDataSuccess>('https://open.neis.go.kr/hub/schoolInfo', {
            query: { LCTN_SC_NM: lctnScNm, SCHUL_NM: schulNm, TYPE: 'json' }
        })
        if ('schoolInfo' in apidata) {
            const schoolInfoArray = apidata.schoolInfo[1].row
            if (schoolInfoArray.length !== 1) return 'ERR_MULTIPLE_OR_NO_SCHOOLS'
            const schoolInfo = schoolInfoArray[0]
            if (schoolInfo) return schoolInfo
        } else return 'ERR_API_CALL_FAILED'
    } catch (error) {
        console.error('Error fetching school default info:', error)
        return 'ERR_API_CALL_FAILED'
    }
}

export function allergenName(code: number) {
    return ALLERGENS.find((item) => item.code === code)?.name || `알레르기 ${code}`
}
