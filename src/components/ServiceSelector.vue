<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatCurrency, serviceGroups, services } from '../data/services'
import SmoothDisclosure from './SmoothDisclosure.vue'
import ServiceWorkspace from './ServiceWorkspace.vue'

const emit = defineEmits(['view-generation'])
const mobileQuery = window.matchMedia('(max-width: 820px)')
const isMobile = ref(mobileQuery.matches)
const expandedGroup = ref(null)
function updateLayout() { isMobile.value = mobileQuery.matches }
onMounted(() => mobileQuery.addEventListener('change', updateLayout))
onBeforeUnmount(() => mobileQuery.removeEventListener('change', updateLayout))

const activeGroup = ref('editing')
const workspaceRefs = new Map()
const tabRefs = new Map()
const groups = serviceGroups.map(group => ({ ...group, services: group.serviceIds.map(id => services.find(service => service.id === id)) }))

function selectGroup(id) { activeGroup.value = id }
function handleGroupKey(event, index) {
  let target
  if (event.key === 'ArrowRight') target = (index + 1) % groups.length
  if (event.key === 'ArrowLeft') target = (index - 1 + groups.length) % groups.length
  if (event.key === 'Home') target = 0
  if (event.key === 'End') target = groups.length - 1
  if (target === undefined) return
  event.preventDefault()
  selectGroup(groups[target].id)
  tabRefs.get(groups[target].id)?.focus()
}
async function openService(request) {
  const group = groups.find(item => item.serviceIds.includes(request.serviceId))
  if (!group) return
  activeGroup.value = group.id
  expandedGroup.value = group.id
  await nextTick()
  await workspaceRefs.get(group.id)?.openService(request)
  document.getElementById(`service-group-panel-${group.id}`)?.scrollTo({ top: 0, behavior: 'instant' })
  document.getElementById('pricing')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  tabRefs.get(group.id)?.focus({ preventScroll: true })
}
defineExpose({ openService })
</script>

<template>
  <section id="pricing" class="services-section section-space" aria-labelledby="services-title">
    <div class="page-width">
      <div class="section-heading services-heading">
        <p class="eyebrow">服務與價格</p>
        <h2 id="services-title">選擇您的方案</h2>
      </div>
      <div v-if="!isMobile" class="business-tabs" role="tablist" aria-label="服務類別">
        <button v-for="(group, index) in groups" :key="group.id" :id="`service-group-${group.id}`"
          :ref="element => element ? tabRefs.set(group.id, element) : tabRefs.delete(group.id)"
          type="button" role="tab" :aria-selected="activeGroup === group.id" :aria-controls="`service-group-panel-${group.id}`"
          :tabindex="activeGroup === group.id ? 0 : -1" @click="selectGroup(group.id)" @keydown="handleGroupKey($event, index)">
          <strong>{{ group.title }}</strong><span>{{ group.description }}</span>
        </button>
      </div>
      <div class="business-frame">
        <template v-for="group in groups" :key="group.id">
          <button v-if="isMobile" :id="`service-group-${group.id}`"
            :ref="element => element ? tabRefs.set(group.id, element) : tabRefs.delete(group.id)"
            type="button" class="service-disclosure-trigger" :aria-expanded="expandedGroup === group.id"
            :aria-controls="`service-group-panel-${group.id}`"
            @click="expandedGroup = expandedGroup === group.id ? null : group.id">
            {{ group.title }}<span aria-hidden="true"></span>
          </button>
          <component :is="isMobile ? SmoothDisclosure : 'section'" :id="`service-group-panel-${group.id}`"
            class="business-panel" :class="{ 'is-active': !isMobile && activeGroup === group.id }"
            :aria-labelledby="`service-group-${group.id}`"
            v-bind="isMobile ? { open: expandedGroup === group.id, role: 'region' }
              : { role: 'tabpanel', 'aria-hidden': activeGroup !== group.id, inert: activeGroup !== group.id }">
          <article v-if="group.services[0].serviceKind === 'generation'" class="generation-offer">
            <h3>{{ group.services[0].title }}</h3>
            <p class="generation-spec">{{ group.services[0].specification }}</p>
            <dl>
              <div v-for="rate in group.services[0].rates" :key="rate.duration">
                <dt>{{ rate.duration }}</dt><dd>{{ formatCurrency(rate.price) }}</dd>
              </div>
            </dl>
            <p>{{ group.services[0].description }}</p>
            <a class="generation-work-link" href="#works" @click="emit('view-generation')">查看 AICG 作品 <span aria-hidden="true">↗</span></a>
          </article>
          <ServiceWorkspace v-else :ref="element => element ? workspaceRefs.set(group.id, element) : workspaceRefs.delete(group.id)"
            :services="group.services" :group-id="group.id" @view-generation="emit('view-generation')" />
          </component>
        </template>
      </div>
      <p v-if="!isMobile" class="service-reading-note">選擇服務查看內容；詳細方案可在區塊內捲動閱讀。</p>
    </div>
  </section>
</template>

<style scoped>
.generation-offer { max-width: 640px; padding: clamp(22px, 5vw, 64px); }
.generation-offer h3 { margin: 0 0 4px; font-size: clamp(26px, 3vw, 40px); }
.generation-offer dl { margin: 0 0 20px; }
.generation-offer dl div { display: flex; align-items: baseline; justify-content: space-between; padding: 12px 0; border-top: 1px solid #324158; }
.generation-offer dd { margin: 0; font-weight: 700; font-size: 22px; }
.generation-offer .generation-spec { margin: 0 0 24px; color: #c3cfe1; font-size: 15px; }
.generation-offer > p:not(.generation-spec) { color: #bdc9da; line-height: 1.8; }
.generation-offer .generation-work-link { margin-top: 12px; }
</style>
