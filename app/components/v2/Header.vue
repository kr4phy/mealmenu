<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import Logo from '~/components/logo.vue'
const route = useRoute()
const { locale, t, toggleLocale } = useV2Locale()
const items = computed<NavigationMenuItem[]>(() => [
    { label: t('today'), to: '/v2', active: route.path === '/v2' },
    { label: t('dateMenu'), to: '/v2/selectedMealMenu', active: route.path.startsWith('/v2/selectedMealMenu') },
    { label: t('settings'), to: '/v2/settings', active: route.path.startsWith('/v2/settings') },
])
</script>
<template>
    <UHeader class="border-b border-gray-200/70 bg-white/80 backdrop-blur">
        <template #title><Logo class="h-6 w-auto" /></template>
        <UNavigationMenu :items="items" />
        <template #right>
            <UBadge color="primary" variant="subtle" class="hidden sm:inline-flex">{{ t('preview') }}</UBadge>
            <UButton color="neutral" variant="outline" size="sm" :aria-label="locale === 'ko' ? 'Switch to English' : '한국어로 전환'" @click="toggleLocale">{{ locale === 'ko' ? 'EN' : '한국어' }}</UButton>
            <UColorModeButton />
            <UTooltip :text="t('openGithub')"><UButton color="neutral" variant="ghost" to="https://github.com/kr4phy/mealmenu" target="_blank" icon="i-simple-icons-github" aria-label="GitHub" /></UTooltip>
        </template>
        <template #body><UNavigationMenu :items="items" orientation="vertical" /></template>
    </UHeader>
</template>
