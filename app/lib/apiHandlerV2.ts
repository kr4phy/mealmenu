import { getConfig, setConfig, fetchSchoolDefaultInfo } from '~/lib/apiHandler'

export type V2Dish = {
    name: string
    allergens: number[]
}

export type V2MealData = {
    breakfast: V2Dish[]
    lunch: V2Dish[]
    dinner: V2Dish[]
}

export const ALLERGENS = [
    { code: 1, name: '난류(계란)' }, { code: 2, name: '우유' }, { code: 3, name: '메밀' },
    { code: 4, name: '땅콩' }, { code: 5, name: '대두' }, { code: 6, name: '밀' },
    { code: 7, name: '고등어' }, { code: 8, name: '게' }, { code: 9, name: '새우' },
    { code: 10, name: '돼지고기' }, { code: 11, name: '복숭아' }, { code: 12, name: '토마토' },
    { code: 13, name: '아황산류' }, { code: 14, name: '호두' }, { code: 15, name: '닭고기' },
    { code: 16, name: '쇠고기' }, { code: 17, name: '오징어' }, { code: 18, name: '조개류' },
    { code: 19, name: '잣' },
] as const

export const getAllergenConfig = (): number[] => {
    if (!import.meta.client) return []
    try {
        const parsed = JSON.parse(localStorage.getItem('allergens') || '[]')
        return Array.isArray(parsed) ? parsed.map(Number).filter((code) => code >= 1 && code <= 19) : []
    } catch {
        return []
    }
}

export const setAllergenConfig = (codes: number[]) => {
    if (import.meta.client) localStorage.setItem('allergens', JSON.stringify(codes))
}

export const parseDish = (raw: string): V2Dish => {
    const match = raw.match(/\(([^()]*)\)\s*$/)
    const allergens = (match?.[1] || '').split(/[.,]/).map(Number).filter((code) => Number.isInteger(code) && code >= 1 && code <= 19)
    return { name: raw.replace(/\s*\([^()]*\)\s*$/, '').trim(), allergens }
}

export const fetchV2MealData = async (date: string): Promise<V2MealData> => {
    const { atptOfcdcScCode, sdSchulCode } = getConfig()
    const empty = { breakfast: [], lunch: [], dinner: [] } as V2MealData
    try {
        const response = await $fetch<any>('https://open.neis.go.kr/hub/mealServiceDietInfo', {
            query: { ATPT_OFCDC_SC_CODE: atptOfcdcScCode, SD_SCHUL_CODE: sdSchulCode, MLSV_YMD: date, TYPE: 'json' },
        })
        const rows = response?.mealServiceDietInfo?.[1]?.row
        if (!Array.isArray(rows)) return empty
        for (const row of rows) {
            const dishes = String(row.DDISH_NM || '').split('<br/>').filter(Boolean).map(parseDish)
            if (row.MMEAL_SC_CODE === '1') empty.breakfast = dishes
            if (row.MMEAL_SC_CODE === '2') empty.lunch = dishes
            if (row.MMEAL_SC_CODE === '3') empty.dinner = dishes
        }
    } catch (error) {
        console.error('Error fetching v2 meal data:', error)
    }
    return empty
}

export const getAllergenName = (code: number) => ALLERGENS.find((item) => item.code === code)?.name || `알레르기 ${code}`
export { getConfig, setConfig, fetchSchoolDefaultInfo }
