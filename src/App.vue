<script setup>
import { ref } from 'vue'
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import ContactSection from './components/ContactSection.vue'
import HeroShowreel from './components/HeroShowreel.vue'
import PlanAdvisor from './components/PlanAdvisor.vue'
import ServiceSelector from './components/ServiceSelector.vue'

const serviceSelector = ref(null)

function scrollTo(target) {
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function openRecommendedService(recommendation) {
  serviceSelector.value?.openService({ serviceId: recommendation.serviceId, tierId: recommendation.tier.id })
}
</script>

<template>
  <AppHeader />
  <main>
    <HeroShowreel @show-services="scrollTo('services')" />
    <ServiceSelector ref="serviceSelector" @contact="scrollTo('contact')" />
    <PlanAdvisor @view-service="openRecommendedService" @contact="scrollTo('contact')" />
    <ContactSection />
  </main>
  <AppFooter />
</template>
