<script setup>
import { nextTick, ref } from 'vue'
import WorkViewer from './WorkViewer.vue'
import { featuredWorks } from '../data/works'
import { usePortfolioReveal } from '../composables/usePortfolioMotion'

const selectedWork = ref(null)
const viewerTrigger = ref(null)
const { section, isMotionReady, isRevealed } = usePortfolioReveal()
const unavailablePosterIds = ref(new Set())
const workCards = featuredWorks.map((work) => ({
  ...work,
  posterPosition: {
    aerial: '58% 50%',
    travel: '50% 44%',
    unboxing: '55% 50%',
  }[work.id],
}))

function isPosterUnavailable(workId) {
  return unavailablePosterIds.value.has(workId)
}

function markPosterUnavailable(workId) {
  unavailablePosterIds.value = new Set([...unavailablePosterIds.value, workId])
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

      <div class="works-gallery__grid portfolio-reveal-item" style="--portfolio-reveal-delay: 90ms" aria-label="作品展示">
        <article
          v-for="work in workCards"
          :id="work.anchorId"
          :key="work.id"
          class="works-card"
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
              aria-haspopup="dialog"
              :aria-label="`開啟${work.title}作品觀看器`"
              @click="openWorkViewer(work, $event)"
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
    </div>
  </section>

  <WorkViewer
    v-if="selectedWork"
    :work="selectedWork"
    @close="closeWorkViewer"
  />
</template>
