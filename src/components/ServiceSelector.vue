<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatCurrency, getPlanPriceLabel, services } from '../data/services'
import CoverServiceDetail from './CoverServiceDetail.vue'
import PlatformIcon from './PlatformIcon.vue'
import PricingPlanDetail from './PricingPlanDetail.vue'

const mobilePricingQuery = '(max-width: 820px)'

const platformLabels = {
  shorts: 'YouTube Shorts',
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  bilibili: 'bilibili',
}

const activeServiceId = ref('short')
const activePlanId = ref(services[0].tiers[0].id)
const activeCoverPlatformId = ref('')
const activeCoverPresetId = ref('')
const mobileExpandedServiceId = ref(null)
const mobileExpandedDurationId = ref(null)
const isMobileViewport = ref(typeof window !== 'undefined' && window.matchMedia(mobilePricingQuery).matches)
let mobileMediaQuery

const activeService = computed(() => (
  services.find((service) => service.id === activeServiceId.value) ?? services[0]
))

const activePlan = computed(() => (
  activeService.value.tiers?.find((tier) => tier.id === activePlanId.value) ?? activeService.value.tiers?.[0] ?? null
))

const groupedPlans = computed(() => groupedPlansFor(activeService.value))

const activeMobilePlan = computed(() => {
  if (!isMobileViewport.value || !mobileExpandedDurationId.value || !activePlanId.value) return null

  const activeGroup = groupedPlans.value.find((group) => group.id === mobileExpandedDurationId.value)
  return activeGroup?.tiers.find((tier) => tier.id === activePlanId.value) ?? null
})

function isCoverService(service) {
  return service.serviceKind === 'cover'
}

function resetCoverSelection() {
  activeCoverPlatformId.value = ''
  activeCoverPresetId.value = ''
}

function groupedPlansFor(service) {
  if (!service.tiers?.length) return []

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

function initializeVideoSelection(service, { expandMobileDuration = false } = {}) {
  const groups = groupedPlansFor(service)
  const activeGroup = groups.find((group) => group.tiers.some((tier) => tier.id === activePlanId.value))
  const targetGroup = activeGroup ?? groups[0]
  const activeTier = targetGroup?.tiers.find((tier) => tier.id === activePlanId.value)
  const targetTier = activeTier ?? targetGroup?.tiers[0]

  activePlanId.value = targetTier?.id ?? ''

  if (expandMobileDuration) {
    mobileExpandedDurationId.value = targetGroup?.id ?? null
  }
}

function initializeCoverSelection(service) {
  const activePlatform = service.coverPlatforms?.find((platform) => platform.id === activeCoverPlatformId.value)
  const targetPlatform = activePlatform ?? service.coverPlatforms?.[0]
  const activePreset = targetPlatform?.presets.find((preset) => preset.id === activeCoverPresetId.value)
  const targetPreset = activePreset ?? targetPlatform?.presets.find((preset) => preset.primary) ?? targetPlatform?.presets[0]

  activeCoverPlatformId.value = targetPlatform?.id ?? ''
  activeCoverPresetId.value = targetPreset?.id ?? ''
}

function selectService(serviceId) {
  const service = services.find((item) => item.id === serviceId)
  if (!service) return

  activeServiceId.value = service.id

  if (isCoverService(service)) {
    activePlanId.value = ''
    initializeCoverSelection(service)
    return
  }

  resetCoverSelection()
  initializeVideoSelection(service)
}

function clearMobilePlanSelection() {
  mobileExpandedDurationId.value = null
  activePlanId.value = ''
}

function toggleMobileService(serviceId) {
  if (isServiceExpanded(serviceId)) {
    mobileExpandedServiceId.value = null
    clearMobilePlanSelection()
    resetCoverSelection()
    return
  }

  const service = services.find((item) => item.id === serviceId)
  if (!service) return

  activeServiceId.value = service.id
  mobileExpandedServiceId.value = service.id

  if (isCoverService(service)) {
    mobileExpandedDurationId.value = null
    activePlanId.value = ''
    initializeCoverSelection(service)
    return
  }

  resetCoverSelection()
  initializeVideoSelection(service, { expandMobileDuration: true })
}

function handleServiceToggle(serviceId) {
  if (isMobileViewport.value) {
    toggleMobileService(serviceId)
    return
  }

  selectService(serviceId)
}

function selectPlan(planId) {
  if (!activeService.value.tiers?.some((tier) => tier.id === planId)) return
  activePlanId.value = planId
}

function toggleMobileDuration(group) {
  if (isCoverService(activeService.value)) return

  if (isDurationExpanded(group.id)) {
    clearMobilePlanSelection()
    return
  }

  mobileExpandedDurationId.value = group.id
  activePlanId.value = group.tiers.find((tier) => tier.id === activePlanId.value)?.id ?? group.tiers[0]?.id ?? ''
}

function selectCoverPlatform(platformId) {
  if (!isCoverService(activeService.value)) return

  const platform = activeService.value.coverPlatforms.find((item) => item.id === platformId)
  if (!platform) return

  activeCoverPlatformId.value = platform.id
  activeCoverPresetId.value = platform.presets.find((preset) => preset.primary)?.id ?? platform.presets[0]?.id ?? ''
}

function selectCoverPreset(presetId) {
  const preset = activeService.value.coverPlatforms
    ?.find((platform) => platform.id === activeCoverPlatformId.value)
    ?.presets.find((item) => item.id === presetId)

  if (!preset) return
  activeCoverPresetId.value = preset.id
}

function makeLeavingPanelInert(element) {
  element.inert = true
  element.setAttribute('aria-hidden', 'true')
}

async function openService({ serviceId, tierId = '' }) {
  const service = services.find((item) => item.id === serviceId)
  if (!service) return

  const selectedTier = service.tiers?.find((tier) => tier.id === tierId)

  activeServiceId.value = service.id

  if (isCoverService(service)) {
    activePlanId.value = ''
    initializeCoverSelection(service)
    mobileExpandedServiceId.value = isMobileViewport.value ? service.id : null
    mobileExpandedDurationId.value = null
  } else if (isMobileViewport.value) {
    resetCoverSelection()
    activePlanId.value = selectedTier?.id ?? ''
    initializeVideoSelection(service, { expandMobileDuration: true })
    mobileExpandedServiceId.value = service.id
  } else {
    resetCoverSelection()
    activePlanId.value = selectedTier?.id ?? ''
    initializeVideoSelection(service)
    mobileExpandedServiceId.value = null
    mobileExpandedDurationId.value = null
  }

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
  mobileExpandedServiceId.value = null
  mobileExpandedDurationId.value = null

  if (event.matches) {
    activePlanId.value = ''
    resetCoverSelection()
    return
  }

  if (isCoverService(activeService.value)) {
    activePlanId.value = ''
    initializeCoverSelection(activeService.value)
    return
  }

  resetCoverSelection()
  initializeVideoSelection(activeService.value)
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
            :class="{
              'is-mobile-expanded': isServiceExpanded(service.id),
              'pricing-service-card--cover': isCoverService(service),
            }"
          >
            <h3>
              <button
                :id="`pricing-trigger-${service.id}`"
                class="pricing-service-card__button"
                :class="{ 'is-active': isServiceHighlighted(service.id) }"
                type="button"
                :aria-controls="isMobileViewport && isServiceExpanded(service.id) ? `pricing-mobile-panel-${service.id}` : undefined"
                :aria-expanded="isMobileViewport ? isServiceExpanded(service.id) : undefined"
                :aria-pressed="isMobileViewport ? undefined : isActiveService(service.id)"
                @click="handleServiceToggle(service.id)"
                @keydown.enter.prevent="handleServiceToggle(service.id)"
                @keydown.space.prevent="handleServiceToggle(service.id)"
              >
                <span class="pricing-service-card__header">
                  <span class="pricing-service-card__identity">
                    <span class="pricing-service-card__title">{{ service.title }}</span>
                  </span>
                  <span v-if="service.platforms.length" class="pricing-service-card__platforms" aria-label="適合發布平台">
                    <span
                      v-for="platform in service.platforms"
                      :key="platform"
                      class="pricing-service-card__platform"
                      :class="{ 'pricing-service-card__platform--shorts': platform === 'shorts' }"
                      role="img"
                      :aria-label="platformLabels[platform]"
                      :title="platformLabels[platform]"
                    >
                      <PlatformIcon :platform="platform" />
                    </span>
                  </span>
                </span>
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

            <Transition name="pricing-mobile-accordion" @before-leave="makeLeavingPanelInert">
              <section
                v-if="isMobileViewport && isServiceExpanded(service.id)"
                :id="`pricing-mobile-panel-${service.id}`"
                class="pricing-mobile-accordion"
                :aria-labelledby="`pricing-trigger-${service.id}`"
                role="region"
              >
                <div class="pricing-mobile-accordion__inner">
                  <CoverServiceDetail
                    v-if="isCoverService(service)"
                    :service="service"
                    :active-platform-id="activeCoverPlatformId"
                    :active-preset-id="activeCoverPresetId"
                    variant="mobile"
                    @select-platform="selectCoverPlatform"
                    @select-preset="selectCoverPreset"
                  />

                  <div v-else class="pricing-mobile-plan-picker" :aria-label="`${service.title}方案`">
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
                          :aria-controls="isDurationExpanded(group.id) ? `pricing-mobile-duration-panel-${group.id}` : undefined"
                          :aria-expanded="isDurationExpanded(group.id)"
                          @click="toggleMobileDuration(group)"
                          @keydown.enter.prevent="toggleMobileDuration(group)"
                          @keydown.space.prevent="toggleMobileDuration(group)"
                        >
                          <span>{{ group.duration }}</span>
                          <span aria-hidden="true">{{ isDurationExpanded(group.id) ? '−' : '+' }}</span>
                        </button>
                      </h4>

                      <Transition name="pricing-mobile-duration-accordion" @before-leave="makeLeavingPanelInert">
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

                          <Transition name="pricing-detail-switch" mode="out-in" @before-leave="makeLeavingPanelInert">
                            <PricingPlanDetail
                              v-if="activeMobilePlan"
                              :key="`${service.id}-${activeMobilePlan.id}`"
                              :content-id="`pricing-mobile-service-content-${service.id}`"
                              :labelledby="`pricing-mobile-plan-trigger-${activeMobilePlan.id}`"
                              :plan="activeMobilePlan"
                              :service="service"
                              variant="mobile"
                            />
                          </Transition>
                        </div>
                      </Transition>
                    </section>
                  </div>

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
            :class="{ 'pricing-workspace--cover': isCoverService(activeService) }"
            :aria-labelledby="`pricing-trigger-${activeService.id}`"
          >
            <header class="pricing-workspace__owner">
              <span class="pricing-workspace__owner-label">目前服務</span>
              <strong class="pricing-workspace__owner-title">{{ activeService.title }}</strong>
            </header>

            <CoverServiceDetail
              v-if="isCoverService(activeService)"
              :service="activeService"
              :active-platform-id="activeCoverPlatformId"
              :active-preset-id="activeCoverPresetId"
              @select-platform="selectCoverPlatform"
              @select-preset="selectCoverPreset"
            />

            <template v-else>
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
                />
              </Transition>
            </template>
          </section>
        </Transition>
      </div>
    </div>
  </section>
</template>
