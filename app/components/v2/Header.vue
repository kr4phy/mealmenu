<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import Logo from '~/components/logo.vue'
const route = useRoute()
const items = computed<NavigationMenuItem[]>(() => [
    { label: '오늘 급식', to: '/v2', active: route.path === '/v2' },
    { label: '날짜별 메뉴', to: '/v2/selectedMealMenu', active: route.path.startsWith('/v2/selectedMealMenu') },
    { label: '설정', to: '/v2/settings', active: route.path.startsWith('/v2/settings') },
])
</script>
<template>
    <UHeader class="border-b border-gray-200/70 bg-white/80 backdrop-blur">
        <template #title><Logo class="h-6 w-auto" /></template>
        <UNavigationMenu :items="items" />
        <template #right>
            <UBadge color="primary" variant="subtle" class="hidden sm:inline-flex">v2 Preview</UBadge>
            <UColorModeButton />
            <UTooltip text="Open on GitHub"><UButton color="neutral" variant="ghost" to="https://github.com/kr4phy/mealmenu" target="_blank" icon="i-simple-icons-github" aria-label="GitHub" /></UTooltip>
        </template>
        <template #body><UNavigationMenu :items="items" orientation="vertical" /></template>
    </UHeader>
</template>
