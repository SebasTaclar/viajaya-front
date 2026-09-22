<template>
  <main class="home-main">
    <section class="section">
      <MainBanner />
    </section>
    <TravelDiscoverySections />
  </main>
</template>

<script setup lang="ts">
import MainBanner from '@/components/MainBanner.vue'
import TravelDiscoverySections from '@/components/TravelDiscoverySections.vue'

defineOptions({
  name: 'HomeView'
})
</script>

<style scoped>
.home-main {
  padding-top: 0;
  background: transparent;
  color: #1A1A1A;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
  min-height: 100vh;
}

.section {
  padding: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}
</style>
