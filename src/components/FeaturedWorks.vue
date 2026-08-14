<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import WorkViewer from './WorkViewer.vue'
import { featuredWorks } from '../data/works'
import { usePortfolioReveal } from '../composables/usePortfolioMotion'

const selectedWork = ref(null)
const viewerTrigger = ref(null)
const { section, isMotionReady, isRevealed } = usePortfolioReveal()
const unavailablePosterIds = ref(new Set())
const activeOrientation = ref('horizontal')
const orientationTabRefs = ref({})
const activeWorkIndexes = ref({
  horizontal: 1,
  vertical: 0,
})
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
const horizontalWorks = computed(() => workCards.filter((work) => work.orientation === 'horizontal'))
const verticalWorks = computed(() => workCards.filter((work) => work.orientation === 'vertical'))
const orientationSections = computed(() => [
  {
    id: 'horizontal',
    title: '橫式作品',
    works: horizontalWorks.value,
  },
  {
    id: 'vertical',
    title: '直式作品',
    works: verticalWorks.value,
  },
])

function isPosterUnavailable(workId) {
  return unavailablePosterIds.value.has(workId)
}

function markPosterUnavailable(workId) {
  unavailablePosterIds.value = new Set([...unavailablePosterIds.value, workId])
}

function setOrientationTabRef(orientation, element) {
  if (element) orientationTabRefs.value[orientation] = element
}

function selectOrientation(orientation) {
  activeOrientation.value = orientation
}

function handleOrientationKeydown(event, orientation) {
  const orientationIds = orientationSections.value.map((section) => section.id)
  const currentIndex = orientationIds.indexOf(orientation)
  let nextIndex

  if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + orientationIds.length) % orientationIds.length
  if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % orientationIds.length
  if (event.key === 'Home') nextIndex = 0
  if (event.key === 'End') nextIndex = orientationIds.length - 1
  if (nextIndex === undefined) return

  event.preventDefault()
  const nextOrientation = orientationIds[nextIndex]
  selectOrientation(nextOrientation)

  nextTick(() => orientationTabRefs.value[nextOrientation]?.focus())
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

  activeCarouselDrag = {
    orientationId: orientation.id,
    totalWorks: orientation.works.length,
    pointerId: event.pointerId,
    startX: event.clientX,
    moved: false,
  }
  event.currentTarget.setPointerCapture(event.pointerId)
  event.currentTarget.classList.add('is-dragging')
}

function handleCarouselPointerMove(event, orientation) {
  if (!activeCarouselDrag || activeCarouselDrag.orientationId !== orientation.id) return

  const distance = event.clientX - activeCarouselDrag.startX
  if (Math.abs(distance) > 12) activeCarouselDrag.moved = true
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

      <div
        class="works-gallery__orientation-tabs portfolio-reveal-item"
        style="--portfolio-reveal-delay: 70ms"
        role="tablist"
        aria-label="作品方向"
      >
        <button
          v-for="orientation in orientationSections"
          :ref="(element) => setOrientationTabRef(orientation.id, element)"
          :id="`works-orientation-tab-${orientation.id}`"
          :key="orientation.id"
          class="works-gallery__orientation-tab"
          type="button"
          role="tab"
          :aria-controls="`works-orientation-panel-${orientation.id}`"
          :aria-selected="activeOrientation === orientation.id"
          :tabindex="activeOrientation === orientation.id ? 0 : -1"
          @click="selectOrientation(orientation.id)"
          @keydown="handleOrientationKeydown($event, orientation.id)"
        >
          {{ orientation.title }}
        </button>
      </div>

      <div class="works-gallery__groups" aria-label="作品展示">
        <section
          v-for="(orientation, index) in orientationSections"
          :id="`works-orientation-panel-${orientation.id}`"
          :key="orientation.id"
          class="works-gallery__group portfolio-reveal-item"
          :class="`works-gallery__group--${orientation.id}`"
          v-show="activeOrientation === orientation.id"
          role="tabpanel"
          :aria-hidden="activeOrientation !== orientation.id ? 'true' : undefined"
          :aria-labelledby="`works-orientation-tab-${orientation.id}`"
          :style="{ '--portfolio-reveal-delay': `${120 + index * 70}ms` }"
        >
          <div class="works-carousel-stage">
            <div
              class="works-carousel"
            :class="`works-carousel--${orientation.id}`"
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
    </div>
  </section>

  <WorkViewer
    v-if="selectedWork"
    :work="selectedWork"
    @close="closeWorkViewer"
  />
</template>
