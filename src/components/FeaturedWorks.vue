<script setup>
import { nextTick, ref } from 'vue'
import WorkViewer from './WorkViewer.vue'
import { featuredWorks } from '../data/works'
import { usePortfolioReveal } from '../composables/usePortfolioMotion'

const selectedWork = ref(null)
const viewerTrigger = ref(null)
const { section, isMotionReady, isRevealed } = usePortfolioReveal()

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
    class="featured-works archive-section portfolio-reveal"
    :class="{ 'is-motion-ready': isMotionReady, 'is-revealed': isRevealed }"
    data-portfolio-experience
    aria-labelledby="featured-works-title"
  >
    <div class="page-width archive-layout">
      <header class="archive-heading portfolio-reveal-item" style="--portfolio-reveal-delay: 0ms">
        <p class="archive-kicker"><span class="archive-index">01</span><span>Selected Works</span></p>
        <h2 id="featured-works-title">精選作品</h2>
      </header>

      <div class="featured-work-grid portfolio-reveal-item" style="--portfolio-reveal-delay: 90ms" aria-label="精選作品">
        <article
          v-for="work in featuredWorks"
          :id="work.anchorId"
          :key="work.id"
          class="featured-work"
          :class="[`featured-work--${work.id}`, `is-${work.orientation}`]"
        >
          <div class="featured-work-media" :style="{ aspectRatio: work.aspectRatio }">
            <button
              class="featured-work-trigger"
              type="button"
              aria-haspopup="dialog"
              :aria-label="`開啟${work.title}作品觀看器`"
              @click="openWorkViewer(work, $event)"
            >
              <img
                class="featured-work-poster"
                :src="work.posterSrc"
                :alt="`${work.title}作品封面`"
                :width="work.orientation === 'vertical' ? 720 : 1280"
                :height="work.orientation === 'vertical' ? 1280 : 720"
                loading="lazy"
              >
              <span class="featured-work-play" aria-hidden="true">
                <span class="featured-work-play-mark">▶</span>
                <span>播放完整作品</span>
              </span>
            </button>
          </div>

          <div class="featured-work-copy">
            <div class="featured-work-meta">
              <span>{{ String(work.featuredOrder).padStart(2, '0') }}</span>
              <span>{{ work.category }}</span>
              <span>{{ work.duration }}</span>
            </div>
            <h3>{{ work.title }}</h3>
            <p class="featured-work-responsibilities">負責：{{ work.responsibilities.join('、') }}</p>
            <p class="featured-work-description">{{ work.description }}</p>
          </div>
        </article>
      </div>

      <div class="featured-work-note portfolio-reveal-item" style="--portfolio-reveal-delay: 170ms" aria-label="作品播放說明">
        <div class="archive-field-meta" aria-hidden="true">
          <span>完整作品</span>
          <span>點擊後播放</span>
        </div>
      </div>
    </div>
  </section>

  <WorkViewer
    v-if="selectedWork"
    :work="selectedWork"
    @close="closeWorkViewer"
  />
</template>
