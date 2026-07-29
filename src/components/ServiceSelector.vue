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
  <section id="pricing" class="services-section section-space" aria-labelledby="services-title">
    <div class="page-width">
      <div class="section-heading services-heading">
        <p class="eyebrow">服務與價格</p>
        <h2 id="services-title">剪輯服務與價格</h2>
        <p>以下為常見剪輯服務與價格參考。</p>
      </div>

      <div class="services-grid" aria-label="服務與價格">
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
