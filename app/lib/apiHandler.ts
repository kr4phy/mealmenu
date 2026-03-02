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
    "schoolInfo": [
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
        "row": SchoolInfo[]
      }
    ]
  }

type APIDataFailure = {
    "RESULT": {
        "CODE": string,
        "MESSAGE": string
    }
}

type APIResponse = MealMenuAPIDataSuccess | APIDataFailure

export type MealData = {
    breakfast: string[],
    lunch: string[],
    dinner: string[],
}

// getConfig() gets runtimeConfig values atptOfcdcScCode and sdSchulCode and return them
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
export function parseDDISH_NM(ddishNmRaw: string): string[] {
    return ddishNmRaw
        .split('<br/>')
        .map((dish: string) => dish.split(' ')[0])
        .filter((item): item is string => Boolean(item))
}

// fetchMealData() fetches meal data from the API using the atptOfcdcScCode, sdSchulCode values and date and return parsed meal data
export async function fetchMealData(atptOfcdcScCode: string, sdSchulCode: string, date: string): Promise<MealData> {
    const mealData = {
        "breakfast": ["Breakfast is not provided this day."],
        "lunch": ["Lunch is not provided this day."],
        "dinner": ["Dinner is not provided this day."]
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
            mealData.breakfast = ["There is no meal information available."]
            mealData.lunch = ["There is no meal information available."]
            mealData.dinner = ["There is no meal information available."]
        }
    } catch (error) {
        console.error("Error fetching meal data:", error)
    }
    return mealData
}

export async function fetchSchoolDefaultInfo(lctnScNm: string, schulNm: string) {
    try {
        const apidata = await $fetch<SchoolInfoAPIDataSuccess>('https://open.neis.go.kr/hub/schoolInfo',
            {
                query: {
                    LCTN_SC_NM: lctnScNm,
                    SCHUL_NM: schulNm,
                    TYPE: 'json'
                }
            }
        )
        if ('schoolInfo' in apidata) {
            const schoolInfoArray = apidata.schoolInfo[1].row

            if (schoolInfoArray.length !== 1) {
                return "ERR_MULTIPLE_OR_NO_SCHOOLS"
            }

            const schoolInfo = schoolInfoArray[0]

            if (schoolInfo) return schoolInfo
        } else {
            return "ERR_API_CALL_FAILED"
        }
    } catch (error) {
        console.error("Error fetching school default info:", error)
        return "ERR_API_CALL_FAILED"
    }
}
