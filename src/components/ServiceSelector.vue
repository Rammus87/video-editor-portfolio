<script setup>
import { computed, ref } from 'vue'
import { services, serviceGroups, getPlanPriceLabel, formatCurrency } from '../data/services'
import PricingReader from './PricingReader.vue'

const emit = defineEmits(['view-generation'])
const groupId = ref('editing')
const serviceId = ref('short')
const planId = ref('30s-basic')
const reader = ref(null)
const group = computed(() => serviceGroups.find(item => item.id === groupId.value))
const groupServices = computed(() => services.filter(item => group.value.serviceIds.includes(item.id)))
const service = computed(() => services.find(item => item.id === serviceId.value))
const choices = computed(() => service.value.tiers ?? service.value.rates?.map((rate, index) => ({ ...rate, id: `rate-${index}`, variant: service.value.title })) ?? [{ id: 'cover', duration: service.value.coverPricing.baseLabel, price: service.value.coverPricing.basePrice, variant: service.value.title }])
const plan = computed(() => choices.value.find(item => item.id === planId.value) ?? choices.value[0])
const durations = computed(() => [...new Set(choices.value.map(item => item.duration))])
const variants = computed(() => choices.value.filter(item => item.duration === plan.value.duration))
const price = computed(() => service.value.pricingFormula ? formatCurrency(plan.value.price) : getPlanPriceLabel(plan.value))
const priceUnit = computed(() => service.value.pricingFormula && plan.value.id === 'more-duration' ? `／每 ${service.value.pricingFormula.unitMinutes} 分鐘` : '')
const delivery = computed(() => plan.value.deliveryLabel ?? service.value.coverPricing?.delivery ?? service.value.specification)
const summary = computed(() => plan.value.included?.filter(item => item !== plan.value.variant).slice(0, 4).join('・') ?? service.value.description ?? service.value.hoverCopy)
const note = computed(() => service.value.pricingFormula?.travelFeeLabel ?? (plan.value.excluded?.length ? `不含${plan.value.excluded.join('、')}` : ''))
function selectService(id) { serviceId.value = id; planId.value = services.find(item => item.id === id).tiers?.[0]?.id ?? 'rate-0' }
function selectGroup(id) { groupId.value = id; selectService(serviceGroups.find(item => item.id === id).serviceIds[0]) }
function selectDuration(duration) { planId.value = choices.value.find(item => item.duration === duration).id }
function openReader(mode, event) { reader.value = { mode, service: service.value, plan: plan.value, trigger: event.currentTarget } }
function keyboardChoice(event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  const buttons = [...event.currentTarget.querySelectorAll('button')]
  const index = buttons.indexOf(event.target)
  if (index < 0) return
  event.preventDefault()
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length
  buttons[next].focus({ preventScroll: true }); buttons[next].click()
}
function openService(request) {
  const owner = serviceGroups.find(item => item.serviceIds.includes(request.serviceId))
  if (!owner) return
  selectGroup(owner.id); selectService(request.serviceId)
  if (request.planId) planId.value = request.planId
}
defineExpose({ openService })
</script>

<template>
  <section id="pricing" class="quote-screen" aria-labelledby="services-title">
    <div class="page-width quote-layout">
      <header class="quote-heading"><p><span>02</span> / 服務與價格</p><h2 id="services-title">選擇您的方案</h2></header>
      <div class="quote-categories" role="group" aria-label="服務類別" @keydown="keyboardChoice">
        <button v-for="item in serviceGroups" :key="item.id" :aria-pressed="groupId === item.id" @click="selectGroup(item.id)">{{ item.id === 'aicg' ? 'AICG' : item.title }}</button>
      </div>
      <div class="quote-controls">
        <div class="quote-services" role="group" aria-label="選擇服務" @keydown="keyboardChoice">
          <button v-for="item in groupServices" :key="item.id" :aria-pressed="serviceId === item.id" @click="selectService(item.id)">{{ { short: '短片', long: '長片', cover: '封面' }[item.id] ?? item.title }}</button>
        </div>
        <div class="quote-durations" role="group" aria-label="選擇長度或規格" @keydown="keyboardChoice">
          <button v-for="duration in durations" :key="duration" :aria-pressed="plan.duration === duration" @click="selectDuration(duration)">{{ duration }}</button>
        </div>
        <div class="quote-variants" :class="{ 'quote-variants--redundant': variants.length === 1 && variants[0].variant === service.title }" :inert="variants.length === 1 && variants[0].variant === service.title" role="group" aria-label="選擇方案" @keydown="keyboardChoice">
          <button v-for="item in variants" :key="item.id" :aria-pressed="plan.id === item.id" @click="planId = item.id">
            <span>{{ item.variant }}</span><span class="quote-choice-status">{{ plan.id === item.id ? '已選' : '選擇' }}</span>
          </button>
        </div>
      </div>
      <div class="quote-summary-frame" aria-live="polite" aria-atomic="true">
        <Transition name="quote-swap"><div :key="service.id + plan.id" class="quote-summary">
          <p class="quote-price" :class="{ 'quote-price--long': price.length > 10 }">{{ price }}<span v-if="priceUnit" class="quote-price-unit">{{ priceUnit }}</span></p>
          <div class="quote-facts"><p>{{ summary }}</p><p>{{ delivery }}</p><p v-if="note" class="quote-note">{{ note }}</p></div>
        </div></Transition>
      </div>
      <div class="quote-actions">
        <button class="quote-primary" aria-haspopup="dialog" @click="openReader('details', $event)">查看完整方案</button>
        <button v-if="service.cooperation" aria-haspopup="dialog" @click="openReader('workflow', $event)">合作流程</button>
        <a v-else-if="service.serviceKind === 'generation'" href="#works" @click="emit('view-generation')">查看 AICG 作品</a>
        <button v-else aria-haspopup="dialog" @click="openReader('details', $event)">平台與尺寸</button>
      </div>
    </div>
    <PricingReader v-if="reader" v-bind="reader" @close="reader = null" />
  </section>
</template>
