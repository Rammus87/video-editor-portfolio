<script setup>
import { nextTick, ref } from 'vue'
import { featuredWorks } from '../data/works'

const activeWorkId = ref('')
const failedWorkIds = ref(new Set())
const videoPlayers = new Map()

function setVideoPlayer(id, element) {
  if (element) videoPlayers.set(id, element)
  else videoPlayers.delete(id)
}

async function playWork(work) {
  activeWorkId.value = work.id
  await nextTick()

  try {
    await videoPlayers.get(work.id)?.play()
  } catch {
    // Native controls remain available when a browser defers playback.
  }
}

function markWorkUnavailable(id) {
  failedWorkIds.value = new Set([...failedWorkIds.value, id])
}
</script>

<template>
  <section id="works" class="featured-works archive-section" aria-labelledby="featured-works-title">
    <div class="page-width archive-layout">
      <header class="archive-heading">
        <p class="archive-kicker"><span class="archive-index">01</span><span>Selected Works</span></p>
        <h2 id="featured-works-title">精選作品</h2>
      </header>

      <div class="featured-work-grid" aria-label="精選作品">
        <article
          v-for="work in featuredWorks"
          :id="work.anchorId"
          :key="work.id"
          class="featured-work"
          :class="[`featured-work--${work.id}`, `is-${work.orientation}`]"
        >
          <div class="featured-work-media" :style="{ aspectRatio: work.aspectRatio }">
            <div v-if="failedWorkIds.has(work.id)" class="featured-work-unavailable" role="status">
              <p>作品影片暫時無法播放</p>
              <span>你仍可查看作品資訊與介紹。</span>
            </div>
            <template v-else-if="activeWorkId === work.id">
              <video
                :id="`${work.id}-player`"
                :ref="(element) => setVideoPlayer(work.id, element)"
                class="featured-work-video"
                :src="work.videoSrc"
                :poster="work.posterSrc"
                controls
                playsinline
                preload="metadata"
                :aria-label="`${work.title}作品播放器`"
                @error="markWorkUnavailable(work.id)"
              />
            </template>
            <template v-else>
              <button class="featured-work-trigger" type="button" :aria-controls="`${work.id}-player`" :aria-label="`播放${work.title}作品`" @click="playWork(work)">
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
            </template>
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

      <div class="featured-work-note" aria-label="作品播放說明">
        <div class="archive-field-meta" aria-hidden="true">
          <span>完整作品</span>
          <span>點擊後播放</span>
        </div>
      </div>
    </div>
  </section>
</template>
