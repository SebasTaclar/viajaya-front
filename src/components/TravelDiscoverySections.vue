<template>
  <section class="travel-discovery">
    <TravelDestinations />
    <TravelSavings />
  </section>
</template>

<script setup lang="ts">
import TravelDestinations from './TravelDestinations.vue'
import TravelSavings from './TravelSavings.vue'

defineOptions({ name: 'TravelDiscoverySections' })
</script>

<style scoped>
.travel-discovery {
  position: relative;
  z-index: 1;
  background: transparent;
  color: #13205a;
  font-family: 'Be Vietnam Pro', sans-serif;
}

.travel-discovery::before {
  display: block;
  width: min(92%, 1180px);
  height: 1px;
  margin: 60px auto 0;
  background: linear-gradient(90deg, transparent, rgba(98, 194, 202, 0.72), transparent);
  content: '';
}
</style>
