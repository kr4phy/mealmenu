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

type APIDataSuccess = {
    "mealServiceDietInfo": [
        {
            "head": [
                {
                    "list_total_count": number
                },
                {
                    "RESULT": {
                        "CODE": string,
                        "MESSAGE": string
                    }
                }
            ]
        },
        {
            "row": MealInfo[]
        }
    ]
}

type APIDataFailure = {
    "RESULT": {
        "CODE": string,
        "MESSAGE": string
    }
}

type APIResponse = APIDataSuccess | APIDataFailure

type MealData = {
    breakfast: string,
    lunch: string,
    dinner: string,
}

// getConfig() gets runtimeConfig values atptOfcdcScCode and sdSchulCode and return them
export function getConfig() {
    const runtimeConfig = useRuntimeConfig()
    let atptOfcdcScCode = runtimeConfig.public.AtptOfcdcScCode as string
    let sdSchulCode = runtimeConfig.public.SdSchulCode as string

    if (import.meta.client) {
        const localAtptOfcdcScCode = localStorage.getItem('atptOfcdcScCode') || ''
        const localSdSchulCode = localStorage.getItem('sdSchulCode') || ''

        if (localAtptOfcdcScCode && localSdSchulCode) {
            atptOfcdcScCode = localAtptOfcdcScCode
            sdSchulCode = localSdSchulCode
        }
    }

    return {
        atptOfcdcScCode: atptOfcdcScCode,
        sdSchulCode: sdSchulCode,
    }
}

// setConfig() sets localStorage values for atptOfcdcScCode and sdSchulCode
export function setConfig(atptOfcdcScCodeValue: string, sdSchulCodeValue: string) {
    if (import.meta.client) {
        localStorage.setItem('atptOfcdcScCode', atptOfcdcScCodeValue)
        localStorage.setItem('sdSchulCode', sdSchulCodeValue)
    }
}

// parseDDISH_NM() parses the raw DDISH_NM string
export function parseDDISH_NM(ddishNmRaw: string) {
    return ddishNmRaw
        .split('<br/>')
        .map((dish: string) => dish.split(' ')[0])
        .join('\n')
}

// fetchMealData() fetches meal data from the API using the atptOfcdcScCode, sdSchulCode values and date and return parsed meal data
export async function fetchMealData(atptOfcdcScCode: string, sdSchulCode: string, date: number): Promise<MealData> {
    const mealData = {
        "breakfast": "No data available",
        "lunch": "No data available",
        "dinner": "No data available"
    
    }
    try {
        const apidata = await $fetch<APIResponse>('https://open.neis.go.kr/hub/mealServiceDietInfo',
            {
                query: {
                        ATPT_OFCDC_SC_CODE: atptOfcdcScCode,
                        SD_SCHUL_CODE: sdSchulCode,
                        MLSV_YMD: date,
                        TYPE: 'json'
                }
            }
        )

        if ('mealServiceDietInfo' in apidata) {
            const mealInfo = apidata.mealServiceDietInfo[1].row
            for (const info of mealInfo) {
                const dishNm = parseDDISH_NM(info.DDISH_NM)
                switch (info.MMEAL_SC_CODE) {
                    case "1":
                        mealData.breakfast = dishNm
                        break
                    case "2":
                        mealData.lunch = dishNm
                        break
                    case "3":
                        mealData.dinner = dishNm
                        break
                    default:
                        break
                }
            }
        } else {
            mealData.breakfast = "No data available"
            mealData.lunch = "No data available"
            mealData.dinner = "No data available"
        }
    } catch (error) {
        console.error("Error fetching meal data:", error)
    }
    return mealData
}
