<script setup>
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import { formatCurrency, getPlanPriceLabel } from '../data/services'
import CooperationTimeline from './CooperationTimeline.vue'

const props = defineProps({
  service: { type: Object, required: true },
  initialTierId: { type: String, default: '' },
})
const emit = defineEmits(['contact'])

const selectedTierId = ref(props.initialTierId || props.service.tiers[0].id)
const selectedTier = computed(() => props.service.tiers.find((tier) => tier.id === selectedTierId.value) ?? props.service.tiers[0])
const hasLongTerm = computed(() => props.service.longTermPlans.length > 0)
const selectedPlanName = computed(() => `${selectedTier.value.duration}｜${selectedTier.value.variant}`)
const selectedPriceLabel = computed(() => getPlanPriceLabel(selectedTier.value))
const timelineSteps = computed(() => props.service.cooperation.steps.map((step) => {
  if (step.id !== 'draft' || !selectedTier.value.draftDeliveryTime) return step

  return {
    ...step,
    description: `${selectedTier.value.draftDeliveryTime}完成初稿，提供雲端預覽確認內容、節奏與畫面方向。`,
  }
}))

function tierTabLabel(tier) {
  if (props.service.id === 'short') return `${tier.duration.replace('內', '')} ${tier.variant.replace('剪輯', '剪')}`
  return tier.duration
}

function formatLongTermQuantity(plan) {
  return `${plan.quantity} 支內／${plan.period.replace('每', '')}`
}

function getEditingPrice(example) {
  return example.durationUnits * props.service.pricingFormula.pricePerUnit
}

watch(
  () => [props.service.id, props.initialTierId],
  () => {
    selectedTierId.value = props.service.tiers.some((tier) => tier.id === props.initialTierId)
      ? props.initialTierId
      : props.service.tiers[0].id
  },
)
</script>

<template>
  <section
    :id="`detail-${service.id}`"
    class="service-detail"
    :class="{ 'has-long-term': hasLongTerm }"
    :aria-label="`${service.title}方案內容`"
  >
    <div class="detail-selector">
      <p class="detail-kicker">選擇規格</p>
      <div class="tier-tabs" role="radiogroup" :aria-label="`${service.title}成片長度與方案`">
        <button
          v-for="tier in service.tiers"
          :key="tier.id"
          type="button"
          class="tier-tab"
          :class="{ 'is-active': selectedTierId === tier.id }"
          role="radio"
          :aria-checked="selectedTierId === tier.id"
          @click="selectedTierId = tier.id"
        >
          {{ tierTabLabel(tier) }}
        </button>
      </div>
    </div>

    <div class="detail-editorial-grid">
      <div class="detail-summary-column">
        <p class="selected-plan-name">{{ selectedPlanName }}</p>
        <p class="detail-price" :class="{ 'is-pending': selectedTier.pricePending, 'is-quote': selectedTier.priceQuote }">{{ selectedPriceLabel }}</p>
        <p class="detail-summary">{{ selectedTier.summary }}</p>

        <div class="delivery-info">
          <span>交付時間</span>
          <b>{{ selectedTier.deliveryLabel }}</b>
          <small>{{ selectedTier.deliveryBreakdown || `預計 ${selectedTier.draftDeliveryTime} 提供初稿` }}</small>
        </div>

        <div class="service-scope">
          <section class="scope-group">
            <h3 class="detail-kicker">包含內容</h3>
            <ul class="inclusion-list">
              <li v-for="item in selectedTier.included" :key="item"><Icon icon="solar:check-circle-linear" aria-hidden="true" />{{ item }}</li>
            </ul>
          </section>

          <section v-if="selectedTier.excluded.length" class="scope-group scope-group--excluded">
            <h3 class="detail-kicker">不包含項目</h3>
            <ul class="exclusion-list">
              <li v-for="item in selectedTier.excluded" :key="item"><Icon icon="solar:minus-circle-linear" aria-hidden="true" />{{ item }}</li>
            </ul>
          </section>
        </div>

        <section v-if="service.pricingFormula" class="aerial-pricing" :aria-labelledby="`${service.id}-pricing-title`">
          <h3 :id="`${service.id}-pricing-title`" class="detail-kicker">{{ service.pricingFormula.title }}</h3>
          <p class="aerial-pricing-headline">{{ service.pricingFormula.headline }}</p>
          <p class="aerial-pricing-note">{{ service.pricingFormula.travelFeeLabel }}</p>
          <ul class="aerial-price-examples">
            <li v-for="example in service.pricingFormula.examples" :key="example.minutes">
              <span>成片 {{ example.minutes }} 分鐘</span>
              <b>車馬費＋{{ formatCurrency(getEditingPrice(example)) }}</b>
            </li>
          </ul>
          <p class="aerial-formula">基礎剪輯費＝計價單位數 × {{ formatCurrency(service.pricingFormula.pricePerUnit) }}<br>總價＝車馬費＋基礎剪輯費</p>
        </section>
      </div>

      <aside class="detail-reading-column">
        <section class="cooperation-column" :aria-labelledby="`${service.id}-workflow-title`">
          <h3 :id="`${service.id}-workflow-title`" class="detail-kicker">{{ service.cooperation.title }}</h3>
          <CooperationTimeline
            :key="service.id"
            :service-id="service.id"
            :steps="timelineSteps"
            :phases="service.cooperation.phases"
            :conclusion="service.cooperation.revisionPolicy.note"
          />
        </section>
      </aside>
    </div>

    <section v-if="hasLongTerm" class="long-term-detail" aria-labelledby="long-term-title">
      <div>
        <h3 id="long-term-title" class="detail-kicker">{{ service.longTermTitle }}</h3>
        <p class="long-term-description">{{ service.longTermDescription }}</p>
      </div>
      <ul class="long-term-plans">
        <li v-for="plan in service.longTermPlans" :key="`${plan.quantity}-${plan.period}`">
          <span>{{ formatLongTermQuantity(plan) }}</span>
          <b>{{ formatCurrency(plan.price) }}</b>
          <small>{{ plan.period }}合作</small>
        </li>
      </ul>
    </section>

    <div class="detail-action service-contact">
      <p>想確認剪輯方式或交付時間，直接聯絡我。</p>
      <button class="cta-button" type="button" @click="emit('contact')">聯絡我 <Icon icon="solar:arrow-right-linear" aria-hidden="true" /></button>
    </div>
  </section>
</template>
