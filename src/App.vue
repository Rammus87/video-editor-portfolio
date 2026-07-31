<script setup>
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import ContactSection from './components/ContactSection.vue'
import FeaturedWorks from './components/FeaturedWorks.vue'
import HeroShowreel from './components/HeroShowreel.vue'
import ServiceSelector from './components/ServiceSelector.vue'

function scrollTo(target) {
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <AppHeader />
  <main class="site-main">
    <HeroShowreel />
    <ServiceSelector @contact="scrollTo('contact')" />
    <FeaturedWorks />
    <ContactSection />
  </main>
  <AppFooter />
</template>
