<script setup>
import { nextTick, ref } from 'vue'
import { formatCurrency, getPlanPriceLabel, services } from '../data/services'

const emit = defineEmits(['contact'])
const activeServiceId = ref('short')

function isActive(serviceId) {
  return activeServiceId.value === serviceId
}

function selectService(serviceId) {
  if (services.some((service) => service.id === serviceId)) activeServiceId.value = serviceId
}

async function openService({ serviceId }) {
  selectService(serviceId)
  await nextTick()
  document.getElementById(`pricing-panel-${serviceId}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function triggerPrice(service) {
  return `${formatCurrency(service.startingPrice)} 起`
}

function triggerSummary(service) {
  return service.cardPriceNote || service.hoverCopy
}

function tierDeliveryLabel(tier) {
  return tier.draftDeliveryTime ? `初稿：${tier.draftDeliveryTime}` : tier.deliveryLabel
}

function formatLongTermPlan(plan) {
  return `${plan.period} ${plan.quantity} 支`
}

function getAerialExamplePrice(service, example) {
  return formatCurrency(example.durationUnits * service.pricingFormula.pricePerUnit)
}

defineExpose({ openService })
</script>

<template>
  <section id="pricing" class="services-section section-space" aria-labelledby="services-title">
    <div class="page-width">
      <div class="section-heading services-heading">
        <p class="eyebrow">服務與價格</p>
        <h2 id="services-title">報價</h2>
        <p>依成片長度、內容需求與素材狀況確認合適的剪輯方式。</p>
      </div>

      <div class="pricing-accordion" aria-label="服務與價格">
        <section
          v-for="service in services"
          :key="service.id"
          class="pricing-accordion__item"
          :class="{ 'is-active': isActive(service.id) }"
        >
          <h3 class="pricing-accordion__heading">
            <button
              :id="`pricing-trigger-${service.id}`"
              class="pricing-accordion__trigger"
              type="button"
              :aria-expanded="isActive(service.id)"
              :aria-controls="`pricing-panel-${service.id}`"
              @click="selectService(service.id)"
              @keydown.enter.prevent="selectService(service.id)"
              @keydown.space.prevent="selectService(service.id)"
            >
              <span class="pricing-accordion__number">{{ service.number }}</span>
              <span class="pricing-accordion__label">
                <span class="pricing-accordion__title">{{ service.title }}</span>
                <span class="pricing-accordion__summary">{{ triggerSummary(service) }}</span>
              </span>
              <span class="pricing-accordion__price">{{ triggerPrice(service) }}</span>
              <span class="pricing-accordion__symbol" aria-hidden="true">{{ isActive(service.id) ? '−' : '+' }}</span>
            </button>
          </h3>

          <div
            :id="`pricing-panel-${service.id}`"
            class="pricing-accordion__panel"
            :class="{ 'is-active': isActive(service.id) }"
            :aria-labelledby="`pricing-trigger-${service.id}`"
            :aria-hidden="!isActive(service.id)"
            :inert="!isActive(service.id)"
            role="region"
          >
            <div class="pricing-accordion__panel-inner">
              <div class="pricing-accordion__content">
                <div class="pricing-plan-list" :aria-label="`${service.title}方案`">
                  <article v-for="tier in service.tiers" :key="tier.id" class="pricing-plan">
                    <div class="pricing-plan__name">
                      <h4>{{ tier.duration }}</h4>
                      <p>{{ tier.variant }}</p>
                    </div>
                    <p
                      class="pricing-plan__price"
                      :class="{ 'is-pending': tier.pricePending, 'is-quote': tier.priceQuote }"
                    >
                      {{ getPlanPriceLabel(tier) }}
                    </p>
                    <div class="pricing-plan__details">
                      <p>{{ tier.summary }}</p>
                      <p><span>包含：</span>{{ tier.included.join('、') }}</p>
                      <p v-if="tier.excluded.length"><span>不包含：</span>{{ tier.excluded.join('、') }}</p>
                    </div>
                    <p class="pricing-plan__delivery">
                      <span>{{ tierDeliveryLabel(tier) }}</span>
                      <small v-if="tier.deliveryBreakdown">{{ tier.deliveryBreakdown }}</small>
                    </p>
                  </article>
                </div>

                <section v-if="service.pricingFormula" class="pricing-aerial" :aria-labelledby="`${service.id}-formula-title`">
                  <p class="pricing-content-label">計價方式</p>
                  <h4 :id="`${service.id}-formula-title`">{{ service.pricingFormula.headline }}</h4>
                  <p>{{ service.pricingFormula.travelFeeLabel }}</p>
                  <ul>
                    <li v-for="example in service.pricingFormula.examples" :key="example.minutes">
                      <span>成片 {{ example.minutes }} 分鐘</span>
                      <strong>車馬費＋{{ getAerialExamplePrice(service, example) }}</strong>
                    </li>
                  </ul>
                </section>

                <section v-if="service.longTermPlans.length" class="pricing-long-term" :aria-labelledby="`${service.id}-long-term-title`">
                  <div>
                    <p class="pricing-content-label">長期合作</p>
                    <h4 :id="`${service.id}-long-term-title`">{{ service.longTermTitle }}</h4>
                    <p>{{ service.longTermDescription }}</p>
                  </div>
                  <ul>
                    <li v-for="plan in service.longTermPlans" :key="`${plan.quantity}-${plan.period}`">
                      <span>{{ formatLongTermPlan(plan) }}</span>
                      <strong>{{ formatCurrency(plan.price) }}</strong>
                    </li>
                  </ul>
                </section>

                <section class="pricing-workflow" :aria-labelledby="`${service.id}-workflow-title`">
                  <div>
                    <p class="pricing-content-label">合作流程</p>
                    <h4 :id="`${service.id}-workflow-title`">{{ service.cooperation.title }}</h4>
                  </div>
                  <ol>
                    <li v-for="step in service.cooperation.steps" :key="step.id">
                      <strong>{{ step.title }}</strong>
                      <span>{{ step.description }}</span>
                    </li>
                  </ol>
                  <p class="pricing-workflow__note">{{ service.cooperation.revisionPolicy.note }}</p>
                </section>

                <div class="pricing-contact">
                  <p>想確認剪輯方式或交付時間，直接聯絡我。</p>
                  <button class="cta-button" type="button" @click="emit('contact')">聯絡我</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>
