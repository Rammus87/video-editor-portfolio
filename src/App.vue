<script setup>
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import FeaturedWorks from './components/FeaturedWorks.vue'
import HeroShowreel from './components/HeroShowreel.vue'
import ServiceSelector from './components/ServiceSelector.vue'
</script>

<template>
  <AppHeader />
  <main class="site-main">
    <HeroShowreel />
    <ServiceSelector />
    <FeaturedWorks />
  </main>
  <AppFooter />
</template>
