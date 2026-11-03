<script setup>
import { Icon } from '@iconify/vue'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { featuredWorks, heroWork } from '../data/works'

const emit = defineEmits(['view-works'])

const configuredShowreelPath = import.meta.env.VITE_SHOWREEL_URL?.trim() || ''
const showreelPath = ref(configuredShowreelPath || heroWork.heroPreviewSrc)
const adventure = featuredWorks.find(work => work.id === 'aicg-adventure')
const video = ref(null)
const adventureVideo = ref(null)
const activeFilm = ref('editing')
const adventureRequested = ref(false)
const videoUnavailable = ref(false)
const adventureUnavailable = ref(false)
const isPaused = ref(false)

async function selectFilm(id) {
  activeFilm.value = id
  if (id === 'adventure') adventureRequested.value = true
  await nextTick()
  syncPlayback()
}

function toggleBackgroundPlayback() {
  isPaused.value = !isPaused.value
  syncPlayback()
}
const reducedMotion = ref(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
const usingConfiguredShowreel = ref(Boolean(configuredShowreelPath))
let motionQuery

function syncPlayback() {
  for (const [id, media] of [['editing', video.value], ['adventure', adventureVideo.value]]) {
    if (!media) continue
    if (id !== activeFilm.value || isPaused.value || reducedMotion.value || document.hidden) {
      media.pause()
    } else {
      media.muted = true
      media.play().catch(() => {})
    }
  }
}

function onMediaError() {
  if (usingConfiguredShowreel.value && showreelPath.value !== heroWork.heroPreviewSrc) {
    usingConfiguredShowreel.value = false
    showreelPath.value = heroWork.heroPreviewSrc
    return
  }

  videoUnavailable.value = true
}

function updateMotionPreference(event) {
  reducedMotion.value = event.matches
  syncPlayback()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionQuery.addEventListener('change', updateMotionPreference)
  document.addEventListener('visibilitychange', syncPlayback)
  updateMotionPreference(motionQuery)
})

onBeforeUnmount(() => {
  video.value?.pause()
  adventureVideo.value?.pause()
  motionQuery?.removeEventListener('change', updateMotionPreference)
  document.removeEventListener('visibilitychange', syncPlayback)
})
</script>

<template>
  <section id="home" class="hero-section reel-home" aria-labelledby="hero-title">
<div class="reel-screen">
          <video
            v-if="showreelPath && !videoUnavailable"
            :key="showreelPath"
            ref="video"
            class="hero-background-video"
            :src="showreelPath"
            :poster="heroWork.posterSrc"
            muted
            loop
            playsinline
            webkit-playsinline
            :controls="false"
            preload="metadata"
            aria-hidden="true"
            @canplay="syncPlayback"
            @loadedmetadata="syncPlayback"
            @error="onMediaError"
          />
          <div v-else class="hero-media-unavailable" aria-live="polite">
            <p>作品集影片準備中</p>
            <span>影片上線後，這裡會呈現代表作品。</span>
          </div>
          <div v-if="adventure" class="hero-adventure" :class="{ 'is-selected': activeFilm === 'adventure' }"
            :style="adventureRequested ? { '--film-poster': 'url(' + adventure.posterSrc + ')' } : undefined" aria-hidden="true">
            <template v-if="adventureRequested">
              <video v-if="!adventureUnavailable" ref="adventureVideo" :src="adventure.videoSrc"
                :poster="adventure.posterSrc" muted loop playsinline preload="metadata"
                @canplay="syncPlayback" @error="adventureUnavailable = true" />
              <img v-else :src="adventure.posterSrc" alt="" />
            </template>
          </div>
        </div>
    <div class="reel-selector page-width">
      <div v-if="adventure" class="hero-film-picker" role="group" aria-label="首頁影片">
        <button type="button" :aria-pressed="activeFilm === 'editing'" @click="selectFilm('editing')"><small aria-hidden="true">01</small>剪輯作品</button>
        <button type="button" :aria-pressed="activeFilm === 'adventure'" @click="selectFilm('adventure')"><small aria-hidden="true">02</small>AICG作品</button>
      </div>
    </div>
    <div class="reel-intro page-width">
      <p class="reel-services">剪輯　／　航拍　／　AI 影片生成</p>
      <h1 id="hero-title"><span>從想法</span><span>到成片</span></h1>
      <div class="hero-actions">
        <a class="cta-button hero-cta" href="#works"
          @click="activeFilm === 'editing' ? emit('view-works', 'editing', heroWork.id) : emit('view-works', 'aicg', adventure.id)">
          {{ activeFilm === 'editing' ? '看剪輯作品' : '看 AICG 作品' }} <Icon icon="solar:arrow-right-linear" aria-hidden="true" /></a>
          <button class="hero-playback" type="button" :aria-pressed="isPaused || reducedMotion"
            :disabled="reducedMotion || (activeFilm === 'editing' ? videoUnavailable : adventureUnavailable)"
            @click="toggleBackgroundPlayback">
            {{ reducedMotion ? '已暫停' : isPaused ? '繼續播放' : '暫停播放' }}
          </button>
      </div>
    </div>
  </section>
</template>
