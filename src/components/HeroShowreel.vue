<script setup>
import { Icon } from '@iconify/vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHeroScrollProgress } from '../composables/useHeroScrollProgress'

const emit = defineEmits(['show-works'])
const showreelPath = import.meta.env.VITE_SHOWREEL_URL || ''
const video = ref(null)
const isPlaying = ref(false)
const videoUnavailable = ref(!showreelPath)
const hero = ref(null)
const entryReady = ref(false)
const skipEntry = ref(false)
const { progress } = useHeroScrollProgress(hero)
let entryFrame
let entryScrollHandler

function stopEntryScrollWatch() {
  if (entryScrollHandler) window.removeEventListener('scroll', entryScrollHandler)
  entryScrollHandler = undefined
}

function showCompletedEntry() {
  if (entryFrame) window.cancelAnimationFrame(entryFrame)
  skipEntry.value = true
  entryReady.value = true
  stopEntryScrollWatch()
}

const heroStyle = computed(() => ({
  '--hero-sky-y': `${-24 * progress.value}px`,
}))

const playerStyle = computed(() => ({
  '--hero-player-y': `${-32 * progress.value}px`,
  '--hero-player-scale': String(1 - progress.value * 0.04),
  '--hero-player-opacity': String(1 - progress.value * 0.65),
}))

const noteStyle = computed(() => ({
  '--hero-note-opacity': String(1 - progress.value * 0.8),
}))

async function togglePlayback() {
  if (!video.value || videoUnavailable.value) return
  if (video.value.paused) {
    try {
      await video.value.play()
      isPlaying.value = true
    } catch {
      videoUnavailable.value = true
    }
  } else {
    video.value.pause()
    isPlaying.value = false
  }
}

function onCanPlay() {
  isPlaying.value = true
  videoUnavailable.value = false
}

onMounted(async () => {
  await nextTick()

  if (window.scrollY > 80 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showCompletedEntry()
    return
  }

  entryScrollHandler = () => {
    if (window.scrollY > 80) showCompletedEntry()
  }
  window.addEventListener('scroll', entryScrollHandler, { passive: true })

  entryFrame = window.requestAnimationFrame(() => {
    entryReady.value = true
  })
})

onBeforeUnmount(() => {
  if (entryFrame) window.cancelAnimationFrame(entryFrame)
  stopEntryScrollWatch()
})
</script>

<template>
  <section
    ref="hero"
    id="top"
    class="hero-section"
    :class="{ 'is-entry-ready': entryReady, 'is-entry-static': skipEntry }"
    :style="heroStyle"
    aria-labelledby="hero-title"
  >
    <div class="hero-sky-layer" aria-hidden="true"></div>
    <div class="hero-inner page-width">
      <div class="hero-copy">
        <p class="eyebrow hero-eyebrow-entry">VIDEO EDITING / TAIWAN</p>
        <h1 id="hero-title">
          <span class="hero-title-line"><span class="hero-title-line-inner">讓影像，替你</span></span>
          <span class="hero-title-line"><span class="hero-title-line-inner">的內容說話。</span></span>
        </h1>
      </div>

      <div class="hero-showreel-motion">
        <div class="hero-player-entry">
          <div class="hero-player-scroll" :style="playerStyle">
            <div class="showreel-wrap">
              <div class="showreel-index" aria-hidden="true"><span>00</span><span>Showreel</span></div>
              <div class="showreel-frame">
                <video
                  v-if="showreelPath"
                  ref="video"
                  class="showreel-video"
                  :src="showreelPath"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="metadata"
                  aria-label="作品集影片播放器"
                  @canplay="onCanPlay"
                  @play="isPlaying = true"
                  @pause="isPlaying = false"
                  @error="videoUnavailable = true"
                />
                <div v-if="videoUnavailable" class="video-placeholder" aria-live="polite">
                  <Icon icon="solar:video-frame-play-horizontal-linear" aria-hidden="true" />
                  <p>作品集影片準備中</p>
                  <span>影片上線後，即可在這裡查看作品。</span>
                </div>
                <div v-else class="video-controls">
                  <button type="button" :aria-label="isPlaying ? '暫停作品集影片' : '播放作品集影片'" @click="togglePlayback">
                    <Icon :icon="isPlaying ? 'solar:pause-linear' : 'solar:play-linear'" aria-hidden="true" />
                  </button>
                  <span>SHOWREEL</span>
                  <span class="control-line" aria-hidden="true"></span>
                  <button type="button" aria-label="切換靜音" @click="video && (video.muted = !video.muted)">
                    <Icon icon="solar:volume-loud-linear" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-note-entry">
          <p class="showreel-note" :style="noteStyle">{{ videoUnavailable ? 'SHOWREEL / 準備中' : 'SHOWREEL / 播放中' }}</p>
        </div>
      </div>

      <div class="hero-support">
        <p class="hero-description hero-description-entry">短片、長片與航拍後製。<br>從內容重點到節奏安排，把素材整理成清楚、好看的成片。</p>
        <button class="cta-button hero-cta-entry" type="button" @click="emit('show-works')">
          查看精選作品 <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>
