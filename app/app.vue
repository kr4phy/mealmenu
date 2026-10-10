<script setup lang="ts">
import Header from './components/header.vue'
import LegacyHeader from './components/legacyHeader.vue'
import V2Header from './components/v2/Header.vue'
import './assets/css/v2.css'

const route = useRoute()
const isV1 = computed(() => route.path === '/v1' || route.path.startsWith('/v1/'))
const isV2 = computed(() => route.path === '/v2' || route.path.startsWith('/v2/'))
</script>

<template>
  <div>
    <UApp>
      <NuxtRouteAnnouncer />
      <LegacyHeader v-if="isV1" />
      <V2Header v-else-if="isV2" />
      <Header v-else />
      <UMain><NuxtLayout><NuxtPage /></NuxtLayout></UMain>
    </UApp>
  </div>
</template>
