<script setup>
import { Icon } from '@iconify/vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { heroWork } from '../data/works'

const configuredShowreelPath = import.meta.env.VITE_SHOWREEL_URL?.trim() || ''
const showreelPath = ref(configuredShowreelPath || heroWork.heroPreviewSrc)
const video = ref(null)
const videoUnavailable = ref(false)
const reducedMotion = ref(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
const usingConfiguredShowreel = ref(Boolean(configuredShowreelPath))
const hero = ref(null)
let motionQuery
let finePointerQuery
let spotlightFrame
let pointerTracking = false
let pointerX = 50
let pointerY = 50

function updateSpotlightPosition() {
  spotlightFrame = undefined
  const element = hero.value
  if (!element) return

  const bounds = element.getBoundingClientRect()
  const x = Math.min(100, Math.max(0, ((pointerX - bounds.left) / bounds.width) * 100))
  const y = Math.min(100, Math.max(0, ((pointerY - bounds.top) / bounds.height) * 100))
  element.style.setProperty('--spotlight-x', `${x}%`)
  element.style.setProperty('--spotlight-y', `${y}%`)
  element.classList.add('is-spotlight-active')
}

function handlePointerMove(event) {
  pointerX = event.clientX
  pointerY = event.clientY
  if (!spotlightFrame) spotlightFrame = window.requestAnimationFrame(updateSpotlightPosition)
}

function handlePointerLeave() {
  hero.value?.classList.remove('is-spotlight-active')
}

function stopPointerTracking() {
  if (!pointerTracking || !hero.value) return
  hero.value.removeEventListener('pointermove', handlePointerMove)
  hero.value.removeEventListener('pointerleave', handlePointerLeave)
  pointerTracking = false
}

function syncPointerTracking() {
  const canTrack = finePointerQuery?.matches && !motionQuery?.matches
  if (canTrack && !pointerTracking && hero.value) {
    hero.value.addEventListener('pointermove', handlePointerMove, { passive: true })
    hero.value.addEventListener('pointerleave', handlePointerLeave)
    pointerTracking = true
    return
  }

  if (!canTrack) {
    stopPointerTracking()
    handlePointerLeave()
  }
}

async function onCanPlay() {
  videoUnavailable.value = false
  await ensureVideoPlayback()
}

async function ensureVideoPlayback() {
  const media = video.value
  if (!media) return

  if (reducedMotion.value) {
    media.pause()
    return
  }

  media.muted = true
  media.defaultMuted = true

  try {
    await media.play()
  } catch {}
}

function onLoadedMetadata() {
  void ensureVideoPlayback()
}

function handleVisibilityChange() {
  if (document.visibilityState === 'visible') void ensureVideoPlayback()
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
  if (reducedMotion.value) {
    video.value?.pause()
  } else {
    void ensureVideoPlayback()
  }
  syncPointerTracking()
}

onMounted(() => {
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
  motionQuery.addEventListener('change', updateMotionPreference)
  finePointerQuery.addEventListener('change', syncPointerTracking)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  updateMotionPreference(motionQuery)
  syncPointerTracking()
  void ensureVideoPlayback()
})

onBeforeUnmount(() => {
  if (spotlightFrame) window.cancelAnimationFrame(spotlightFrame)
  stopPointerTracking()
  motionQuery?.removeEventListener('change', updateMotionPreference)
  finePointerQuery?.removeEventListener('change', syncPointerTracking)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <section
    ref="hero"
    id="home"
    class="hero-section"
    aria-labelledby="hero-title"
  >
    <video
      v-if="showreelPath && !videoUnavailable"
      :key="showreelPath"
      ref="video"
      class="hero-background-video"
      :src="showreelPath"
      :poster="heroWork.posterSrc"
      :autoplay="!reducedMotion"
      muted
      loop
      playsinline
      webkit-playsinline
      :controls="false"
      preload="metadata"
      aria-hidden="true"
      @canplay="onCanPlay"
      @loadedmetadata="onLoadedMetadata"
      @error="onMediaError"
    />
    <div v-else class="hero-media-unavailable" aria-live="polite">
      <p>作品集影片準備中</p>
      <span>影片上線後，這裡會呈現代表作品。</span>
    </div>
    <div class="hero-dark-overlay" aria-hidden="true"></div>
    <div class="hero-spotlight-overlay" aria-hidden="true"></div>

    <div class="hero-content page-width">
      <div class="hero-copy">
        <h1 id="hero-title">
          <span>讓剪輯</span>
          <span>替你的內容說話。</span>
        </h1>
        <p class="hero-description">我幫你把內容剪清楚。</p>
        <a class="cta-button hero-cta" href="#works">
          查看精選作品 <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
</template>
