export type V2Locale = 'ko' | 'en'

type TranslationKey =
    | 'today' | 'dateMenu' | 'settings' | 'preview' | 'openGithub'
    | 'heroEyebrow' | 'heroTitle' | 'heroDescription' | 'allergySettings'
    | 'breakfast' | 'lunch' | 'dinner' | 'items' | 'noMenu'
    | 'myAllergies' | 'allergyHint' | 'allergyDisclaimer' | 'allergyWarning'
    | 'otherDate' | 'otherDateTitle' | 'viewMenu' | 'personalized'
    | 'personalizedTitle' | 'personalizedDescription' | 'educationCode'
    | 'schoolCode' | 'findSchool' | 'findSchoolTitle' | 'province' | 'schoolName'
    | 'search' | 'allergiesToAvoid' | 'allergyDescription' | 'save'
    | 'savedTitle' | 'savedDescription' | 'schoolNotFound' | 'schoolNotFoundDescription'

const messages: Record<V2Locale, Record<TranslationKey, string>> = {
    ko: {
        today: '오늘 급식', dateMenu: '날짜별 메뉴', settings: '설정', preview: 'v2 미리보기', openGithub: 'GitHub에서 열기',
        heroEyebrow: 'MealMenu / V2', heroTitle: '오늘 뭐 먹지?', heroDescription: '오늘의 급식 메뉴를 한눈에 확인하세요.', allergySettings: '알레르기 설정',
        breakfast: '아침', lunch: '점심', dinner: '저녁', items: '가지', noMenu: '등록된 메뉴가 없습니다.', myAllergies: '내 알레르기 기준으로 표시 중',
        allergyHint: '메뉴에 포함된 번호와 일치하면 주의 표시가 나타납니다.', allergyDisclaimer: '알레르기 번호는 학교 급식 원본 데이터 기준입니다. 알레르기 유무는 조리 환경에 따라 달라질 수 있습니다.', allergyWarning: '주의',
        otherDate: '다른 날짜 보기', otherDateTitle: '원하는 날짜의 메뉴를 찾아보세요', viewMenu: '메뉴 보기', personalized: '개인화 설정', personalizedTitle: '나에게 맞는 급식 보기', personalizedDescription: '선택한 알레르기 정보가 메뉴에서 바로 강조됩니다.',
        educationCode: '교육청 코드', schoolCode: '학교 코드', findSchool: '학교 찾기', findSchoolTitle: '학교 찾기', province: '시도', schoolName: '학교 이름', search: '검색', allergiesToAvoid: '주의할 알레르기', allergyDescription: '메뉴에 포함된 번호와 일치하면 빨간색 주의 표시가 나타납니다.', save: '설정 저장',
        savedTitle: '설정 저장 완료', savedDescription: '메뉴 화면에 알레르기 주의 표시가 적용됩니다.', schoolNotFound: '학교를 찾지 못했어요', schoolNotFoundDescription: '시도와 학교 이름을 확인해 주세요.',
    },
    en: {
        today: "Today's menu", dateMenu: 'Menu by date', settings: 'Settings', preview: 'v2 Preview', openGithub: 'Open on GitHub',
        heroEyebrow: 'MealMenu / V2', heroTitle: 'What are we having today?', heroDescription: "See today's school menu at a glance.", allergySettings: 'Allergy settings',
        breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', items: 'items', noMenu: 'No menu registered.', myAllergies: 'Highlighting your allergy preferences',
        allergyHint: 'A warning appears when a menu contains one of your selected allergens.', allergyDisclaimer: 'Allergy numbers come from the school meal source. Preparation environments may vary.', allergyWarning: 'Warning',
        otherDate: 'Browse another date', otherDateTitle: 'Find the menu for any date', viewMenu: 'View menu', personalized: 'Personalization', personalizedTitle: 'Make your menu work for you', personalizedDescription: 'Selected allergies are highlighted directly in the menu.',
        educationCode: 'Education code', schoolCode: 'School code', findSchool: 'Find school', findSchoolTitle: 'Find school', province: 'Province', schoolName: 'School name', search: 'Search', allergiesToAvoid: 'Allergies to avoid', allergyDescription: 'Menus matching these numbers will show a red warning.', save: 'Save settings',
        savedTitle: 'Settings saved', savedDescription: 'Allergy warnings are now active on the menu.', schoolNotFound: 'School not found', schoolNotFoundDescription: 'Please check the province and school name.',
    },
}

const allergenNamesEn: Record<number, string> = {
    1: 'Eggs', 2: 'Milk', 3: 'Buckwheat', 4: 'Peanuts', 5: 'Soybeans', 6: 'Wheat', 7: 'Mackerel', 8: 'Crab', 9: 'Shrimp', 10: 'Pork', 11: 'Peaches', 12: 'Tomatoes', 13: 'Sulfites', 14: 'Walnuts', 15: 'Chicken', 16: 'Beef', 17: 'Squid', 18: 'Shellfish', 19: 'Pine nuts',
}

export const useV2Locale = () => {
    const locale = useState<V2Locale>('v2-locale', () => 'ko')
    onMounted(() => {
        const saved = localStorage.getItem('v2-locale')
        if (saved === 'ko' || saved === 'en') locale.value = saved
    })
    const t = (key: TranslationKey) => messages[locale.value][key]
    const toggleLocale = () => {
        locale.value = locale.value === 'ko' ? 'en' : 'ko'
        localStorage.setItem('v2-locale', locale.value)
    }
    const allergenName = (code: number, koreanName: string) => locale.value === 'en' ? (allergenNamesEn[code] || koreanName) : koreanName
    return { locale, t, toggleLocale, allergenName }
}
