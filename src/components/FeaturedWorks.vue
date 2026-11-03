<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import WorkViewer from './WorkViewer.vue'
import { featuredWorks } from '../data/works'
import { usePortfolioReveal } from '../composables/usePortfolioMotion'

const selectedWork = ref(null)
const viewerTrigger = ref(null)
const { section, isMotionReady, isRevealed } = usePortfolioReveal()
const unavailablePosterIds = ref(new Set())
const categories = [{ id: 'aicg', title: 'AICG' }, { id: 'editing', title: '剪輯' }]
const directions = [{ id: 'horizontal', title: '橫式' }, { id: 'vertical', title: '直式' }]
const category = ref('aicg')
const directionByCategory = ref({ aicg: 'horizontal', editing: 'horizontal' })
const activeGroup = computed(() => category.value + '-' + directionByCategory.value[category.value])
const activeWorkIndexes = ref({ 'editing-horizontal': 1 })
const categoryButtons = new Map()
let activeCarouselDrag = null
let suppressWorkOpen = false
let suppressWorkOpenTimer = null
const workCards = featuredWorks.map((work) => ({
  ...work,
  posterPosition: {
    aerial: '58% 50%',
    travel: '50% 44%',
    unboxing: '55% 50%',
  }[work.id],
}))
const groups = categories.flatMap(type => directions.map(direction => ({
  id: type.id + '-' + direction.id,
  direction: direction.id,
  title: type.title + '・' + direction.title,
  works: workCards.filter(work =>
    (work.productionType === 'aicg' ? 'aicg' : 'editing') === type.id &&
    work.orientation === direction.id),
})))

const currentWork = computed(() => groups.find(group => group.id === activeGroup.value)
  ?.works[getActiveWorkIndex(activeGroup.value)])

function isPosterUnavailable(workId) {
  return unavailablePosterIds.value.has(workId)
}

function markPosterUnavailable(workId) {
  unavailablePosterIds.value = new Set([...unavailablePosterIds.value, workId])
}

function navigateFilter(event) {
  const buttons = [...event.currentTarget.querySelectorAll('button')]
  const index = buttons.indexOf(event.target)
  if (index < 0) return
  const target = { ArrowLeft: (index + buttons.length - 1) % buttons.length,
    ArrowRight: (index + 1) % buttons.length, Home: 0, End: buttons.length - 1 }[event.key]
  if (target === undefined) return
  event.preventDefault()
  buttons[target].focus()
  buttons[target].click()
}

function getActiveWorkIndex(orientation) {
  return activeWorkIndexes.value[orientation] ?? 0
}

function setActiveWork(orientation, index, totalWorks) {
  const nextIndex = Math.max(0, Math.min(index, totalWorks - 1))

  if (nextIndex === getActiveWorkIndex(orientation)) return

  activeWorkIndexes.value = {
    ...activeWorkIndexes.value,
    [orientation]: nextIndex,
  }
}

function moveActiveWork(orientation, direction, totalWorks) {
  setActiveWork(orientation, getActiveWorkIndex(orientation) + direction, totalWorks)
}

function getCardPosition(orientation, index) {
  const distance = index - getActiveWorkIndex(orientation)

  if (distance === 0) return 'active'
  if (distance === -1) return 'previous'
  if (distance === 1) return 'next'
  return 'far'
}

function handleCarouselKeydown(event, orientation) {
  if (event.target !== event.currentTarget) return

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    moveActiveWork(orientation.id, -1, orientation.works.length)
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    moveActiveWork(orientation.id, 1, orientation.works.length)
  }

  if (event.key === 'Home') {
    event.preventDefault()
    setActiveWork(orientation.id, 0, orientation.works.length)
  }

  if (event.key === 'End') {
    event.preventDefault()
    setActiveWork(orientation.id, orientation.works.length - 1, orientation.works.length)
  }
}

function handleCarouselPointerDown(event, orientation) {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  if (event.target.closest('.works-carousel__control')) return

  activeCarouselDrag = {
    orientationId: orientation.id,
    totalWorks: orientation.works.length,
    pointerId: event.pointerId,
    startX: event.clientX,
    moved: false,
  }
  event.currentTarget.classList.add('is-dragging')
}

function handleCarouselPointerMove(event, orientation) {
  if (!activeCarouselDrag || activeCarouselDrag.orientationId !== orientation.id) return

  const distance = event.clientX - activeCarouselDrag.startX
  if (Math.abs(distance) > 12) {
    activeCarouselDrag.moved = true
    event.currentTarget.setPointerCapture(event.pointerId)
  }
}

function handleCarouselPointerEnd(event, orientation) {
  if (!activeCarouselDrag || activeCarouselDrag.orientationId !== orientation.id) return

  const distance = event.clientX - activeCarouselDrag.startX
  const didDrag = activeCarouselDrag.moved

  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  event.currentTarget.classList.remove('is-dragging')
  activeCarouselDrag = null

  if (!didDrag) return

  if (Math.abs(distance) >= 36) {
    moveActiveWork(orientation.id, distance < 0 ? 1 : -1, orientation.works.length)
  }

  suppressWorkOpen = true
  if (suppressWorkOpenTimer) window.clearTimeout(suppressWorkOpenTimer)
  suppressWorkOpenTimer = window.setTimeout(() => {
    suppressWorkOpen = false
    suppressWorkOpenTimer = null
  }, 0)
}

function handleWorkCardClick(work, orientation, index, totalWorks, event) {
  if (suppressWorkOpen) {
    event.preventDefault()
    return
  }

  if (getActiveWorkIndex(orientation) !== index) {
    setActiveWork(orientation, index, totalWorks)
    return
  }

  openWorkViewer(work, event)
}

function openWorkViewer(work, event) {
  viewerTrigger.value = event.currentTarget
  selectedWork.value = work
}

async function closeWorkViewer() {
  selectedWork.value = null

  await nextTick()
  viewerTrigger.value?.focus()
}

async function openWorks(type, workId) {
  category.value = type
  const group = groups.find(item => item.id.startsWith(type + '-') && item.works.some(work => work.id === workId))
  if (group) {
    directionByCategory.value[type] = group.direction
    setActiveWork(group.id, group.works.findIndex(work => work.id === workId), group.works.length)
  }
  await nextTick()
  categoryButtons.get(type)?.focus({ preventScroll: true })
}
defineExpose({ openWorks })

onBeforeUnmount(() => {
  if (suppressWorkOpenTimer) window.clearTimeout(suppressWorkOpenTimer)
})
</script>

<template>
  <section
    ref="section"
    id="works"
    class="featured-works works-gallery archive-section portfolio-reveal"
    :class="{ 'is-motion-ready': isMotionReady, 'is-revealed': isRevealed }"
    data-portfolio-experience
    aria-labelledby="featured-works-title"
  >
    <div class="page-width works-gallery__layout">
      <header class="works-gallery__header portfolio-reveal-item" style="--portfolio-reveal-delay: 0ms">
        <h2 id="featured-works-title">作品</h2>
      </header>

      <div class="work-filters">
        <div class="work-filter-row work-filter-row--category" role="group" aria-label="作品分類" @keydown="navigateFilter">
          <button v-for="type in categories" :key="type.id" type="button"
            :ref="el => el ? categoryButtons.set(type.id, el) : categoryButtons.delete(type.id)"
            :aria-pressed="category === type.id" @click="category = type.id">{{ type.title }}</button>
        </div>
        <div class="work-filter-row work-filter-row--direction" role="group" :aria-label="(category === 'aicg' ? 'AICG' : '剪輯') + '作品方向'" @keydown="navigateFilter">
          <button v-for="direction in directions" :key="direction.id" type="button"
            :aria-pressed="directionByCategory[category] === direction.id"
            @click="directionByCategory[category] = direction.id">{{ direction.title }}</button>
        </div>
      </div>

      <div class="works-gallery__groups" aria-label="作品展示">
        <section v-for="orientation in groups" :key="orientation.id"
          class="works-gallery__group work-filter-panel"
          :class="{ 'is-active': activeGroup === orientation.id }"
          :inert="activeGroup !== orientation.id"
          :aria-label="orientation.title">
          <div v-if="!orientation.works.length" class="generation-empty">
            <h3>目前沒有{{ orientation.title }}作品</h3>
          </div>
          <div v-else class="works-carousel-stage">
            <div
              class="works-carousel"
            :class="`works-carousel--${orientation.direction}`"
            :aria-label="`${orientation.title}輪播，可使用左右方向鍵瀏覽`"
            role="region"
            tabindex="0"
            @keydown="handleCarouselKeydown($event, orientation)"
            @pointerdown="handleCarouselPointerDown($event, orientation)"
            @pointermove="handleCarouselPointerMove($event, orientation)"
            @pointerup="handleCarouselPointerEnd($event, orientation)"
            @pointercancel="handleCarouselPointerEnd($event, orientation)"
          >
            <div class="works-carousel__controls" :aria-label="`${orientation.title}輪播控制`" role="group">
              <button
                class="works-carousel__control works-carousel__control--previous"
                type="button"
                :disabled="getActiveWorkIndex(orientation.id) === 0"
                :aria-label="`上一個${orientation.title}`"
                @click="moveActiveWork(orientation.id, -1, orientation.works.length)"
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                class="works-carousel__control works-carousel__control--next"
                type="button"
                :disabled="getActiveWorkIndex(orientation.id) === orientation.works.length - 1"
                :aria-label="`下一個${orientation.title}`"
                @click="moveActiveWork(orientation.id, 1, orientation.works.length)"
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <article
              v-for="(work, workIndex) in orientation.works"
              :id="work.anchorId"
              :key="work.id"
              class="works-card"
              :class="`works-card--${getCardPosition(orientation.id, workIndex)}`"
              :aria-hidden="getCardPosition(orientation.id, workIndex) === 'far' ? 'true' : undefined"
            >
              <span class="works-card__selection-frame" aria-hidden="true">
                <span class="works-card__selection-corner works-card__selection-corner--top-left"></span>
                <span class="works-card__selection-corner works-card__selection-corner--top-right"></span>
                <span class="works-card__selection-corner works-card__selection-corner--bottom-left"></span>
                <span class="works-card__selection-corner works-card__selection-corner--bottom-right"></span>
              </span>
              <div class="works-card__media">
                <button
                  class="works-card__trigger"
                  type="button"
                  :aria-haspopup="getCardPosition(orientation.id, workIndex) === 'active' ? 'dialog' : undefined"
                  :aria-label="getCardPosition(orientation.id, workIndex) === 'active'
                    ? `開啟${work.title}作品觀看器`
                    : `選取${work.title}作品`"
                  :aria-current="getCardPosition(orientation.id, workIndex) === 'active' ? 'true' : undefined"
                  :tabindex="getCardPosition(orientation.id, workIndex) === 'active' ? 0 : -1"
                  @click="handleWorkCardClick(work, orientation.id, workIndex, orientation.works.length, $event)"
                >
                  <img
                    v-if="!isPosterUnavailable(work.id)"
                    class="works-card__poster"
                    :src="work.posterSrc"
                    :alt="`${work.title}作品封面`"
                    :width="work.orientation === 'vertical' ? 720 : 1280"
                    :height="work.orientation === 'vertical' ? 1280 : 720"
                    :loading="work.featuredOrder === 1 ? 'eager' : 'lazy'"
                    :style="{ objectPosition: work.posterPosition }"
                    @error="markPosterUnavailable(work.id)"
                  >
                  <span v-else class="works-card__unavailable" role="status">
                    <strong>作品封面暫時無法載入</strong>
                    <span>{{ work.title }}</span>
                  </span>
                  <span class="works-play-mark" aria-hidden="true">▶</span>
                </button>
              </div>
            </article>
            </div>

            <div
              class="works-carousel__position"
              :aria-label="`${orientation.title}位置`"
              role="group"
            >
            <button
              v-for="(work, workIndex) in orientation.works"
              :key="`${work.id}-position`"
              class="works-carousel__position-button"
              :class="{ 'is-active': getActiveWorkIndex(orientation.id) === workIndex }"
              type="button"
              :aria-current="getActiveWorkIndex(orientation.id) === workIndex ? 'true' : undefined"
              :aria-label="`切換到第 ${workIndex + 1} 個${orientation.title}`"
              @click="setActiveWork(orientation.id, workIndex, orientation.works.length)"
            ></button>
            </div>
          </div>
        </section>
      </div>
      <div class="works-caption-frame" aria-live="polite"><Transition name="motion-content" mode="out-in"><div :key="currentWork?.id" class="works-current-caption">
        <strong>{{ currentWork?.title }}</strong>
        <span>{{ currentWork?.category }}</span>
        <span v-if="!currentWork">真實作品上架後開放觀看</span>
      </div></Transition></div>
    </div>
  </section>

  <WorkViewer
    v-if="selectedWork"
    :work="selectedWork"
    @close="closeWorkViewer"
  />
</template>
