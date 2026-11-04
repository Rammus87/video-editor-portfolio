<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatCurrency, getPlanPriceLabel } from '../data/services'
import CoverServiceDetail from './CoverServiceDetail.vue'
const props = defineProps({ service: Object, plan: Object, mode: String, trigger: Object })
const emit = defineEmits(['close'])
const dialog = ref(null)
const visible = ref(false)
const closing = ref(false)
const platformId = ref(props.service.coverPlatforms?.[0].id)
const presetId = ref(props.service.coverPlatforms?.[0].presets[0].id)
let timer, frame
let previousOverflow
function selectPlatform(id) { platformId.value = id; presetId.value = props.service.coverPlatforms.find(item => item.id === id).presets[0].id }
function finish() {
  clearTimeout(timer)
  dialog.value?.close()
  document.body.style.overflow = previousOverflow
  props.trigger?.focus({ preventScroll: true })
  emit('close')
}
function close() {
  if (closing.value) return
  closing.value = true
  visible.value = false
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return finish()
  timer = setTimeout(finish, 360)
}
function onTransition(event) { if (closing.value && event.target === event.currentTarget && event.propertyName === 'transform') finish() }
onMounted(async () => {
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  await nextTick()
  dialog.value.showModal()
  dialog.value.querySelector('button').focus({ preventScroll: true })
  frame = requestAnimationFrame(() => { dialog.value.getBoundingClientRect(); if (!closing.value) visible.value = true })
})
onBeforeUnmount(() => { clearTimeout(timer); cancelAnimationFrame(frame); document.body.style.overflow = previousOverflow })
</script>
<template>
  <Teleport to="body">
    <dialog ref="dialog" class="quote-reader" :class="{ 'is-visible': visible }" aria-labelledby="quote-reader-title" @cancel.prevent="close" @click="event => event.target === dialog && close()">
      <section class="quote-reader-sheet" @transitionend="onTransition">
        <header><div><p>{{ service.title }}</p><h2 id="quote-reader-title">{{ mode === 'workflow' ? '合作流程' : '完整方案' }}</h2></div><button @click="close" aria-label="關閉方案">關閉</button></header>
        <div class="quote-reader-body">
          <template v-if="mode === 'details'">
            <CoverServiceDetail v-if="service.serviceKind === 'cover'" :service="service" :active-platform-id="platformId" :active-preset-id="presetId" @select-platform="selectPlatform" @select-preset="presetId = $event" />
            <template v-else>
              <h3>{{ plan.duration }}・{{ plan.variant }}</h3><p class="reader-price">{{ getPlanPriceLabel(plan) }}</p>
              <p>{{ plan.summary ?? service.description }}</p>
              <p>{{ plan.deliveryLabel ?? service.specification }}</p><p v-if="plan.deliveryBreakdown">{{ plan.deliveryBreakdown }}</p>
              <template v-if="plan.included"><h4>包含內容</h4><ul><li v-for="item in plan.included" :key="item">{{ item }}</li></ul></template>
              <template v-if="plan.excluded?.length"><h4>不包含內容</h4><ul><li v-for="item in plan.excluded" :key="item">{{ item }}</li></ul></template>
              <template v-if="service.pricingFormula"><h4>{{ service.pricingFormula.headline }}</h4><p>{{ service.pricingFormula.travelFeeLabel }}</p><p v-for="example in service.pricingFormula.examples" :key="example.minutes">成片 {{ example.minutes }} 分鐘：車馬費＋{{ formatCurrency(example.durationUnits * service.pricingFormula.pricePerUnit) }}</p></template>
              <template v-if="service.longTermPlans?.length"><h4>長期合作</h4><p>{{ service.longTermDescription }}</p><p v-for="item in service.longTermPlans" :key="item.quantity">{{ item.period }} {{ item.quantity }} 支：{{ formatCurrency(item.price) }}</p></template>
            </template>
          </template>
          <template v-if="service.cooperation">
            <h3>合作流程</h3><ol><li v-for="step in service.cooperation.steps" :key="step.id"><strong>{{ step.title }}</strong><p>{{ step.description }}</p></li></ol><p>{{ service.cooperation.revisionPolicy.note }}</p>
          </template>
        </div>
      </section>
    </dialog>
  </Teleport>
</template>
