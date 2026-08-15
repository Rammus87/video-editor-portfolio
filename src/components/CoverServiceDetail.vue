<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../data/services'
import PlatformIcon from './PlatformIcon.vue'

const props = defineProps({
  service: { type: Object, required: true },
  activePlatformId: { type: String, default: '' },
  activePresetId: { type: String, default: '' },
  variant: { type: String, default: 'desktop' },
})

const emit = defineEmits(['select-platform', 'select-preset'])

const activePlatform = computed(() => (
  props.service.coverPlatforms.find((platform) => platform.id === props.activePlatformId) ?? null
))

const activePreset = computed(() => (
  activePlatform.value?.presets.find((preset) => preset.id === props.activePresetId) ?? null
))

const hasMultiplePresets = computed(() => activePlatform.value?.presets.length > 1)

function presetStateLabel(preset) {
  if (preset.extensionPrice) return `+${formatCurrency(preset.extensionPrice)}`
  if (preset.primary) return '主比例'
  return ''
}
</script>

<template>
  <section
    class="pricing-cover-detail"
    :class="`pricing-cover-detail--${variant}`"
    :aria-label="`${service.title}平台與封面比例`"
  >
    <section class="pricing-cover-platform-stage" aria-labelledby="cover-platform-title">
      <p id="cover-platform-title" class="pricing-detail-label">選擇發布平台</p>
      <div class="pricing-cover-platform-grid" role="radiogroup" aria-labelledby="cover-platform-title">
        <button
          v-for="platform in service.coverPlatforms"
          :key="platform.id"
          class="pricing-cover-platform"
          :class="{ 'has-mark': platform.assetKey, 'is-active': activePlatformId === platform.id }"
          type="button"
          role="radio"
          :aria-checked="activePlatformId === platform.id"
          @click="emit('select-platform', platform.id)"
          @keydown.enter.prevent="emit('select-platform', platform.id)"
          @keydown.space.prevent="emit('select-platform', platform.id)"
        >
          <span v-if="platform.assetKey" class="pricing-cover-platform__mark" aria-hidden="true">
            <PlatformIcon :platform="platform.assetKey" />
          </span>
          <span class="pricing-cover-platform__label">{{ platform.label }}</span>
        </button>
      </div>
    </section>

    <section class="pricing-cover-preset-stage" aria-labelledby="cover-preset-title">
      <p id="cover-preset-title" class="pricing-detail-label">{{ hasMultiplePresets ? '選擇封面比例' : '標準比例' }}</p>
      <template v-if="activePlatform && activePreset">
        <div v-if="hasMultiplePresets" class="pricing-cover-preset-options" role="radiogroup" aria-labelledby="cover-preset-title">
          <button
            v-for="preset in activePlatform.presets"
            :key="preset.id"
            class="pricing-cover-preset"
            :class="{ 'is-active': activePresetId === preset.id }"
            type="button"
            role="radio"
            :aria-checked="activePresetId === preset.id"
            @click="emit('select-preset', preset.id)"
            @keydown.enter.prevent="emit('select-preset', preset.id)"
            @keydown.space.prevent="emit('select-preset', preset.id)"
          >
            <span>{{ preset.label }}</span>
            <small v-if="presetStateLabel(preset)">{{ presetStateLabel(preset) }}</small>
          </button>
        </div>
        <div v-else class="pricing-cover-preset-single">
          <span>
            <strong>{{ activePreset.displayName || '標準比例' }}</strong>
            <small v-if="activePreset.secondary">{{ activePreset.secondary }}</small>
          </span>
          <b>{{ activePreset.label }}</b>
        </div>
      </template>
      <p v-else class="pricing-cover-preset-stage__empty">先選擇發布平台。</p>
    </section>

    <section v-if="activePreset" class="pricing-cover-price" aria-live="polite" aria-labelledby="cover-pricing-title">
      <div class="pricing-cover-price__headline">
        <p id="cover-pricing-title" class="pricing-detail-label">{{ activePlatform.label }} / {{ activePreset.displayName || activePreset.label }}</p>
        <p class="pricing-cover-price__base">{{ formatCurrency(service.coverPricing.basePrice) }}</p>
        <p class="pricing-cover-price__base-note">{{ service.coverPricing.baseLabel }}</p>
      </div>

      <dl class="pricing-cover-price__facts">
        <div>
          <dt>交付</dt>
          <dd>{{ service.coverPricing.delivery }}</dd>
        </div>
        <div>
          <dt>修改</dt>
          <dd>{{ service.coverPricing.revisions }}</dd>
        </div>
      </dl>

      <p class="pricing-cover-price__new-design">
        <strong>重新設計</strong>
        <span>{{ service.coverPricing.newDesignRule }} {{ formatCurrency(service.coverPricing.newDesignPrice) }} / 新設計</span>
      </p>
    </section>
  </section>
</template>
