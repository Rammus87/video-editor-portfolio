<script setup>
import { formatCurrency, getPlanPriceLabel } from '../data/services'

defineProps({
  contentId: { type: String, required: true },
  labelledby: { type: String, required: true },
  plan: { type: Object, required: true },
  service: { type: Object, required: true },
  variant: { type: String, default: 'desktop' },
})

defineEmits(['contact'])

function tierDeliveryLabel(tier) {
  return tier.draftDeliveryTime ? `初稿：${tier.draftDeliveryTime}` : tier.deliveryLabel
}

function formatLongTermPlan(plan) {
  return `${plan.period} ${plan.quantity} 支`
}

function getAerialExamplePrice(service, example) {
  return formatCurrency(example.durationUnits * service.pricingFormula.pricePerUnit)
}
</script>

<template>
  <article
    :id="contentId"
    class="pricing-detail-panel"
    :class="`pricing-detail-panel--${variant}`"
    :aria-labelledby="labelledby"
    role="region"
  >
    <p class="pricing-a11y-status" aria-live="polite">
      目前顯示：{{ plan.duration }}，{{ plan.variant }}，{{ getPlanPriceLabel(plan) }}
    </p>

    <h3 class="pricing-detail-panel__sr-title">{{ plan.duration }}・{{ plan.variant }}</h3>

    <div class="pricing-detail-panel__columns">
      <div class="pricing-detail-panel__primary">
        <section>
          <p class="pricing-detail-label">適用情境</p>
          <p class="pricing-detail-panel__copy">{{ plan.summary }}</p>
        </section>

        <section>
          <p class="pricing-detail-label">包含內容</p>
          <ul class="pricing-detail-list">
            <li v-for="item in plan.included" :key="item">{{ item }}</li>
          </ul>
        </section>
      </div>

      <aside class="pricing-detail-panel__secondary">
        <section class="pricing-detail-delivery">
          <p class="pricing-detail-label">交付時間</p>
          <p class="pricing-detail-panel__delivery">{{ tierDeliveryLabel(plan) }}</p>
          <small v-if="plan.deliveryBreakdown">{{ plan.deliveryBreakdown }}</small>
        </section>

        <section v-if="plan.excluded.length" class="pricing-detail-excluded">
          <p class="pricing-detail-label pricing-detail-label--muted">不包含內容</p>
          <ul class="pricing-detail-list pricing-detail-list--muted">
            <li v-for="item in plan.excluded" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section v-if="service.pricingFormula" class="pricing-detail-side-section" :aria-labelledby="`pricing-${variant}-${service.id}-formula-title`">
          <p class="pricing-detail-label">計價方式</p>
          <h4 :id="`pricing-${variant}-${service.id}-formula-title`">{{ service.pricingFormula.headline }}</h4>
          <p>{{ service.pricingFormula.travelFeeLabel }}</p>
          <ul class="pricing-detail-mini-list">
            <li v-for="example in service.pricingFormula.examples" :key="example.minutes">
              <span>成片 {{ example.minutes }} 分鐘</span>
              <strong>車馬費＋{{ getAerialExamplePrice(service, example) }}</strong>
            </li>
          </ul>
        </section>
      </aside>
    </div>

    <section :key="`${service.id}-${plan.id}`" class="pricing-workflow" :aria-labelledby="`pricing-${variant}-${service.id}-workflow-title`">
      <div class="pricing-workflow__heading">
        <h4 :id="`pricing-${variant}-${service.id}-workflow-title`">合作流程</h4>
      </div>
      <ol>
        <li
          v-for="(step, index) in service.cooperation.steps"
          :key="step.id"
          :style="{ '--pricing-flow-delay': `${index * 110}ms` }"
        >
          <span class="pricing-workflow__node" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <div><strong>{{ step.title }}</strong></div>
        </li>
      </ol>
      <p class="pricing-workflow__note">{{ service.cooperation.revisionPolicy.note }}</p>
    </section>

    <section v-if="service.longTermPlans.length" class="pricing-fixed-output" :aria-labelledby="`pricing-${variant}-${service.id}-long-term-title`">
      <h4 :id="`pricing-${variant}-${service.id}-long-term-title`">長期合作</h4>
      <ul>
        <li v-for="longTermPlan in service.longTermPlans" :key="`${longTermPlan.quantity}-${longTermPlan.period}`">
          <span>{{ formatLongTermPlan(longTermPlan) }}</span>
          <strong>{{ formatCurrency(longTermPlan.price) }}</strong>
        </li>
      </ul>
    </section>

    <div class="pricing-detail-contact">
      <p>想確認剪輯方式或交付時間，直接聯絡我。</p>
      <button class="cta-button" type="button" @click="$emit('contact')">聯絡我</button>
    </div>
  </article>
</template>
