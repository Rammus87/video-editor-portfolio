<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatCurrency, getPlanPriceLabel, services } from '../data/services'
import PricingPlanDetail from './PricingPlanDetail.vue'

const mobilePricingQuery = '(max-width: 820px)'

const emit = defineEmits(['contact'])
const activeServiceId = ref('short')
const activePlanId = ref(services[0].tiers[0].id)
const mobileExpandedServiceId = ref(null)
const mobileExpandedDurationId = ref(null)
const isMobileViewport = ref(typeof window !== 'undefined' && window.matchMedia(mobilePricingQuery).matches)
let mobileMediaQuery

const activeService = computed(() => (
  services.find((service) => service.id === activeServiceId.value) ?? services[0]
))

const activePlan = computed(() => (
  activeService.value.tiers.find((tier) => tier.id === activePlanId.value) ?? activeService.value.tiers[0]
))

const groupedPlans = computed(() => groupedPlansFor(activeService.value))

function groupedPlansFor(service) {
  const groups = []
  const groupsByDuration = new Map()

  service.tiers.forEach((tier) => {
    let group = groupsByDuration.get(tier.duration)

    if (!group) {
      group = {
        id: `pricing-duration-${service.id}-${groups.length + 1}`,
        duration: tier.duration,
        tiers: [],
      }
      groupsByDuration.set(tier.duration, group)
      groups.push(group)
    }

    group.tiers.push(tier)
  })

  return groups
}

function isActiveService(serviceId) {
  return activeServiceId.value === serviceId
}

function isActivePlan(planId) {
  return activePlanId.value === planId
}

function isServiceExpanded(serviceId) {
  return mobileExpandedServiceId.value === serviceId
}

function isDurationExpanded(durationId) {
  return mobileExpandedDurationId.value === durationId
}

function isServiceHighlighted(serviceId) {
  return isMobileViewport.value ? isServiceExpanded(serviceId) : isActiveService(serviceId)
}

function selectService(serviceId) {
  const service = services.find((item) => item.id === serviceId)
  if (!service) return

  activeServiceId.value = service.id
  activePlanId.value = service.tiers[0].id
}

function toggleMobileService(serviceId) {
  if (isServiceExpanded(serviceId)) {
    mobileExpandedServiceId.value = null
    mobileExpandedDurationId.value = null
    return
  }

  selectService(serviceId)
  mobileExpandedServiceId.value = serviceId
  mobileExpandedDurationId.value = null
}

function handleServiceToggle(serviceId) {
  if (isMobileViewport.value) {
    toggleMobileService(serviceId)
    return
  }

  selectService(serviceId)
}

function selectPlan(planId) {
  if (!activeService.value.tiers.some((tier) => tier.id === planId)) return
  activePlanId.value = planId
}

function toggleMobileDuration(group) {
  if (isDurationExpanded(group.id)) {
    mobileExpandedDurationId.value = null
    return
  }

  activePlanId.value = group.tiers[0].id
  mobileExpandedDurationId.value = group.id
}

async function openService({ serviceId, tierId = '' }) {
  const service = services.find((item) => item.id === serviceId)
  if (!service) return

  activeServiceId.value = service.id
  activePlanId.value = service.tiers.some((tier) => tier.id === tierId)
    ? tierId
    : service.tiers[0].id
  mobileExpandedServiceId.value = isMobileViewport.value ? service.id : null
  mobileExpandedDurationId.value = isMobileViewport.value
    ? groupedPlansFor(service).find((group) => group.tiers.some((tier) => tier.id === activePlanId.value))?.id ?? null
    : null

  await nextTick()
  const targetId = isMobileViewport.value
    ? `pricing-mobile-panel-${service.id}`
    : 'pricing-service-content'
  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function triggerPrice(service) {
  return `${formatCurrency(service.startingPrice)} 起`
}

function triggerSummary(service) {
  return service.cardPriceNote || service.hoverCopy
}

function syncMobileViewport(event) {
  isMobileViewport.value = event.matches
  if (!event.matches) {
    mobileExpandedServiceId.value = null
    mobileExpandedDurationId.value = null
  }
}

onMounted(() => {
  mobileMediaQuery = window.matchMedia(mobilePricingQuery)
  syncMobileViewport(mobileMediaQuery)
  mobileMediaQuery.addEventListener('change', syncMobileViewport)
})

onBeforeUnmount(() => {
  mobileMediaQuery?.removeEventListener('change', syncMobileViewport)
})

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

      <div class="pricing-card-selector" aria-label="服務與價格">
        <div class="pricing-service-grid" aria-label="主要服務">
          <article
            v-for="service in services"
            :key="service.id"
            class="pricing-service-card"
            :class="{ 'is-mobile-expanded': isServiceExpanded(service.id) }"
          >
            <h3>
              <button
                :id="`pricing-trigger-${service.id}`"
                class="pricing-service-card__button"
                :class="{ 'is-active': isServiceHighlighted(service.id) }"
                type="button"
                :aria-controls="isMobileViewport ? `pricing-mobile-panel-${service.id}` : undefined"
                :aria-expanded="isMobileViewport ? isServiceExpanded(service.id) : undefined"
                :aria-pressed="isMobileViewport ? undefined : isActiveService(service.id)"
                @click="handleServiceToggle(service.id)"
                @keydown.enter.prevent="handleServiceToggle(service.id)"
                @keydown.space.prevent="handleServiceToggle(service.id)"
              >
                <span class="pricing-service-card__number">{{ service.number }}</span>
                <span class="pricing-service-card__title">{{ service.title }}</span>
                <span class="pricing-service-card__summary">{{ triggerSummary(service) }}</span>
                <span class="pricing-service-card__footer">
                  <span>{{ triggerPrice(service) }}</span>
                  <span class="pricing-service-card__hint pricing-service-card__hint--desktop" aria-hidden="true">
                    {{ isActiveService(service.id) ? '目前選擇' : '查看方案' }}
                  </span>
                  <span class="pricing-service-card__toggle" aria-hidden="true">
                    {{ isServiceExpanded(service.id) ? '−' : '+' }}
                  </span>
                </span>
              </button>
            </h3>

            <Transition name="pricing-mobile-accordion">
              <section
                v-if="isMobileViewport && isServiceExpanded(service.id)"
                :id="`pricing-mobile-panel-${service.id}`"
                class="pricing-mobile-accordion"
                :aria-labelledby="`pricing-trigger-${service.id}`"
                role="region"
              >
                <div class="pricing-mobile-accordion__inner">
                  <div class="pricing-mobile-plan-picker" :aria-label="`${service.title}方案`">
                    <section
                      v-for="group in groupedPlansFor(service)"
                      :key="group.id"
                      class="pricing-mobile-duration-group"
                      :class="{ 'is-expanded': isDurationExpanded(group.id) }"
                    >
                      <h4>
                        <button
                          :id="`pricing-mobile-${group.id}`"
                          class="pricing-mobile-duration-trigger"
                          type="button"
                          :aria-controls="`pricing-mobile-duration-panel-${group.id}`"
                          :aria-expanded="isDurationExpanded(group.id)"
                          @click="toggleMobileDuration(group)"
                          @keydown.enter.prevent="toggleMobileDuration(group)"
                          @keydown.space.prevent="toggleMobileDuration(group)"
                        >
                          <span>{{ group.duration }}</span>
                          <span aria-hidden="true">{{ isDurationExpanded(group.id) ? '−' : '+' }}</span>
                        </button>
                      </h4>

                      <Transition name="pricing-mobile-duration-accordion">
                        <div
                          v-if="isDurationExpanded(group.id)"
                          :id="`pricing-mobile-duration-panel-${group.id}`"
                          class="pricing-mobile-duration-group__content"
                          :aria-labelledby="`pricing-mobile-${group.id}`"
                          role="region"
                        >
                          <div class="pricing-mobile-duration-group__options">
                            <button
                              v-for="tier in group.tiers"
                              :id="`pricing-mobile-plan-trigger-${tier.id}`"
                              :key="tier.id"
                              class="pricing-mobile-plan"
                              :class="{ 'is-active': isActivePlan(tier.id) }"
                              type="button"
                              :aria-pressed="isActivePlan(tier.id)"
                              @click="selectPlan(tier.id)"
                              @keydown.enter.prevent="selectPlan(tier.id)"
                              @keydown.space.prevent="selectPlan(tier.id)"
                            >
                              <span>{{ tier.variant }}</span>
                              <strong :class="{ 'is-pending': tier.pricePending, 'is-quote': tier.priceQuote }">
                                {{ getPlanPriceLabel(tier) }}
                              </strong>
                            </button>
                          </div>

                          <Transition name="pricing-detail-switch" mode="out-in">
                            <PricingPlanDetail
                              :key="`${service.id}-${activePlan.id}`"
                              :content-id="`pricing-mobile-service-content-${service.id}`"
                              :labelledby="`pricing-mobile-plan-trigger-${activePlan.id}`"
                              :plan="activePlan"
                              :service="service"
                              variant="mobile"
                              mobile-core-only
                              @contact="emit('contact')"
                            />
                          </Transition>
                        </div>
                      </Transition>
                    </section>
                  </div>

                  <Transition name="pricing-detail-switch" mode="out-in">
                    <PricingPlanDetail
                      v-if="mobileExpandedDurationId"
                      :key="`${service.id}-${activePlan.id}-secondary`"
                      :content-id="`pricing-mobile-service-secondary-${service.id}`"
                      :labelledby="`pricing-mobile-plan-trigger-${activePlan.id}`"
                      :plan="activePlan"
                      :service="service"
                      variant="mobile"
                      mobile-secondary-only
                      @contact="emit('contact')"
                    />
                  </Transition>
                </div>
              </section>
            </Transition>
          </article>
        </div>

        <Transition name="pricing-workspace-switch" mode="out-in">
          <section
            v-if="!isMobileViewport"
            :id="`pricing-panel-${activeService.id}`"
            :key="activeService.id"
            class="pricing-workspace"
            :aria-labelledby="`pricing-trigger-${activeService.id}`"
          >
            <aside class="pricing-plan-picker" aria-labelledby="pricing-plan-picker-title">
              <p id="pricing-plan-picker-title" class="pricing-detail-label">選擇方案</p>

              <section
                v-for="group in groupedPlans"
                :key="group.id"
                class="pricing-duration-group"
                :aria-labelledby="group.id"
              >
                <h3 :id="group.id">{{ group.duration }}</h3>
                <div class="pricing-duration-group__options" :aria-label="`${group.duration}方案`">
                  <button
                    v-for="tier in group.tiers"
                    :id="`pricing-plan-trigger-${tier.id}`"
                    :key="tier.id"
                    class="pricing-grouped-plan"
                    :class="{ 'is-active': isActivePlan(tier.id) }"
                    type="button"
                    :aria-pressed="isActivePlan(tier.id)"
                    @click="selectPlan(tier.id)"
                    @keydown.enter.prevent="selectPlan(tier.id)"
                    @keydown.space.prevent="selectPlan(tier.id)"
                  >
                    <span>{{ tier.variant }}</span>
                    <strong :class="{ 'is-pending': tier.pricePending, 'is-quote': tier.priceQuote }">
                      {{ getPlanPriceLabel(tier) }}
                    </strong>
                  </button>
                </div>
              </section>
            </aside>

            <Transition name="pricing-detail-switch" mode="out-in">
              <PricingPlanDetail
                :key="`${activeService.id}-${activePlan.id}`"
                content-id="pricing-service-content"
                :labelledby="`pricing-plan-trigger-${activePlan.id}`"
                :plan="activePlan"
                :service="activeService"
                @contact="emit('contact')"
              />
            </Transition>
          </section>
        </Transition>
      </div>
    </div>
  </section>
</template>
