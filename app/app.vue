<script setup lang="ts">
import Header from './components/header.vue';

</script>

<template>
  <div>
    <UApp>
      <NuxtRouteAnnouncer />
      <Header />
      <NuxtPage />
    </UApp>
  </div>
</template>
