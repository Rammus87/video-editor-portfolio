<script setup>
import { ref } from 'vue'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import FeaturedWorks from './components/FeaturedWorks.vue'
import HeroShowreel from './components/HeroShowreel.vue'
import ServiceSelector from './components/ServiceSelector.vue'
const worksSection = ref(null)
function showWorks(category, workId) { worksSection.value?.openWorks(category, workId) }
</script>

<template>
  <AppHeader />
  <main class="site-main">
    <HeroShowreel @view-works="showWorks" />
    <ServiceSelector @view-generation="showWorks('aicg')" />
    <FeaturedWorks ref="worksSection" />
  </main>
  <AppFooter />
</template>
