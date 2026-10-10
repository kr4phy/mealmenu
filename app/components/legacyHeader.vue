<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import Logo from './logo.vue';

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Home',
    to: '/v1',
    active: route.path === '/v1'
  },
  {
    label: 'Selected Meal Menu',
    to: '/v1/selectedMealMenu',
    active: route.path.startsWith('/v1/selectedMealMenu')
  },
  {
    label: 'Settings',
    to: '/v1/settings',
    active: route.path.startsWith('/v1/settings')
  }
])
</script>

<template>
  <UHeader>
    <template #title>
      <Logo class="h-6 w-auto" />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/kr4phy/mealmenu"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>
    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" />
    </template>
  </UHeader>
</template>
