<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  work: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])
const dialog = ref(null)
const video = ref(null)
const isMediaUnavailable = ref(false)
const isVisible = ref(false)
const isClosing = ref(false)
const ENTER_DURATION_MS = 360
const EXIT_DURATION_MS = 320
let closeEmitted = false
let openTimer = null
let closeTimer = null

function clearTimers() {
  if (openTimer) window.clearTimeout(openTimer)
  if (closeTimer) window.clearTimeout(closeTimer)
  openTimer = null
  closeTimer = null
}

function resetPlayback() {
  video.value?.pause()

  try {
    video.value.currentTime = 0
  } catch {
    // The media may not have loaded metadata before the viewer closes.
  }
}

async function startPlayback() {
  if (!video.value || isClosing.value) return

  try {
    video.value.currentTime = 0
    await video.value.play()
  } catch {
    // A direct video click can retry playback when the browser defers it.
  }
}

function finishClose() {
  if (closeEmitted) return

  closeEmitted = true
  clearTimers()
  resetPlayback()
  document.body.classList.remove('work-viewer-open')
  if (dialog.value?.open) dialog.value.close()
  emit('close')
}

function requestClose() {
  if (closeEmitted || isClosing.value) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishClose()
    return
  }
  isClosing.value = true
  isVisible.value = false
  resetPlayback()
  closeTimer = window.setTimeout(finishClose, EXIT_DURATION_MS + 80)
}

function handleExitTransitionEnd(event) {
  if (!isClosing.value || event.target !== event.currentTarget || event.propertyName !== 'transform') return
  finishClose()
}

function handleCancel(event) {
  event.preventDefault()
  requestClose()
}

function handleBackdropClick(event) {
  if (event.target === dialog.value) requestClose()
}

function markMediaUnavailable() {
  isMediaUnavailable.value = true
}

onMounted(async () => {
  document.body.classList.add('work-viewer-open')
  await nextTick()

  if (!dialog.value?.open) dialog.value?.showModal()
  dialog.value?.focus()

  window.requestAnimationFrame(() => {
    if (!isClosing.value) isVisible.value = true
  })

  openTimer = window.setTimeout(startPlayback, ENTER_DURATION_MS)
})

onBeforeUnmount(() => {
  clearTimers()
  resetPlayback()
  document.body.classList.remove('work-viewer-open')
})
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="work-viewer"
      :class="[
        `work-viewer--${props.work.orientation}`,
        { 'is-visible': isVisible, 'is-closing': isClosing },
      ]"
      :aria-labelledby="`work-viewer-accessible-title-${props.work.id}`"
      tabindex="-1"
      @cancel="handleCancel"
      @keydown.escape.stop.prevent="requestClose('escape')"
      @click="handleBackdropClick"
    >
      <button class="work-viewer__close" type="button" aria-label="關閉作品觀看器" @click="requestClose">關閉 ×</button>
      <p :id="`work-viewer-accessible-title-${props.work.id}`" class="work-viewer__accessible-title">
        {{ `${props.work.title}作品觀看器` }}
      </p>
      <div
        class="work-viewer__media"
        :style="{ aspectRatio: props.work.aspectRatio }"
        @click.stop
        @transitionend="handleExitTransitionEnd"
      >
        <video
          v-if="!isMediaUnavailable"
          ref="video"
          class="work-viewer__video"
          :src="props.work.videoSrc"
          :poster="props.work.posterSrc"
          controls
          playsinline
          preload="metadata"
          :aria-label="`${props.work.title}作品影片；點擊可播放或暫停`"
          @ended="requestClose('ended')"
          @error="markMediaUnavailable"
        />
        <div v-else class="work-viewer__unavailable" role="status">
          <p>作品影片暫時無法播放</p>
          <span>請稍後再試。</span>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
