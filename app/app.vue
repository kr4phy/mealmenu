<script setup lang="ts">
import Header from './components/header.vue';

</script>

<template>
  <div>
    <UApp>
      <NuxtRouteAnnouncer />
      <Header />
      <UMain>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UMain>
    </UApp>
  </div>
</template>
