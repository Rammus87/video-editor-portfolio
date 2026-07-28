<script setup>
import { computed, nextTick, ref } from 'vue'
import { services } from '../data/services'
import ServiceCard from './ServiceCard.vue'
import ServiceDetail from './ServiceDetail.vue'

const emit = defineEmits(['contact'])
const selectedId = ref(null)
const selectedTierId = ref('')
const selectedService = computed(() => services.find((service) => service.id === selectedId.value))

function selectService(id) {
  selectedId.value = selectedId.value === id ? null : id
  selectedTierId.value = ''
}

async function openService({ serviceId, tierId = '' }) {
  selectedId.value = serviceId
  selectedTierId.value = tierId
  await nextTick()
  document.getElementById(`detail-${serviceId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

defineExpose({ openService })
</script>

<template>
  <section id="services" class="services-section section-space" aria-labelledby="services-title">
    <div class="page-width">
      <div class="section-heading services-heading">
        <h2 id="services-title">這次想剪哪一種影片？</h2>
        <p>先選擇最接近需求的類型，再查看價格與合作流程。</p>
      </div>

      <div class="services-grid" aria-label="服務選擇">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-card-reveal"
        >
          <ServiceCard
            :service="service"
            :selected="selectedId === service.id"
            @select="selectService"
          />
        </div>
      </div>

      <Transition name="detail-reveal">
        <ServiceDetail
          v-if="selectedService"
          :service="selectedService"
          :initial-tier-id="selectedTierId"
          @contact="emit('contact')"
        />
      </Transition>
    </div>
  </section>
</template>
