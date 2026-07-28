<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps({
  service: { type: Object, required: true },
  selected: { type: Boolean, default: false },
})

defineEmits(['select'])

const formattedStartingPrice = computed(() => new Intl.NumberFormat('zh-TW').format(props.service.startingPrice))
</script>

<template>
  <button
    class="service-card"
    :class="{ 'is-selected': selected }"
    type="button"
    :aria-expanded="selected"
    :aria-controls="`detail-${service.id}`"
    @click="$emit('select', service.id)"
  >
    <span class="card-topline">
      <span class="service-number">{{ service.number }}</span>
      <Icon class="service-card-icon" :icon="service.icon" aria-hidden="true" />
    </span>
    <span class="service-card-content">
      <span class="service-title">{{ service.title }}</span>
      <span class="service-hover-copy">{{ service.hoverCopy }}</span>
      <span class="service-price-line">
        <span class="service-starting-price" :aria-label="`起始價格 NT$${formattedStartingPrice} 起`">
          <span>NT$</span><b>{{ formattedStartingPrice }}</b><span>起</span>
        </span>
        <Icon class="card-arrow" icon="solar:arrow-right-linear" aria-hidden="true" />
      </span>
    </span>
  </button>
</template>
