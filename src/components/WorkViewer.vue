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
let closeEmitted = false

function stopPlayback() {
  video.value?.pause()
}

function finishClose() {
  if (closeEmitted) return

  closeEmitted = true
  stopPlayback()
  document.body.classList.remove('work-viewer-open')
  emit('close')
}

function requestClose() {
  stopPlayback()

  if (dialog.value?.open) dialog.value.close()
  else finishClose()
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

  try {
    await video.value?.play()
  } catch {
    // Native controls and the poster remain available when playback is deferred.
  }
})

onBeforeUnmount(() => {
  stopPlayback()
  document.body.classList.remove('work-viewer-open')
})
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="work-viewer"
      :class="[`work-viewer--${props.work.orientation}`]"
      :aria-labelledby="`work-viewer-title-${props.work.id}`"
      @cancel="handleCancel"
      @close="finishClose"
      @click="handleBackdropClick"
    >
      <div class="work-viewer__frame">
        <header class="work-viewer__header">
          <p :id="`work-viewer-title-${props.work.id}`" class="work-viewer__identity"><span>{{ String(props.work.featuredOrder).padStart(2, '0') }}</span><span>{{ props.work.title }}</span></p>
          <button class="work-viewer__close" type="button" aria-label="關閉" @click="requestClose">關閉</button>
        </header>

        <div class="work-viewer__content">
          <div class="work-viewer__media" :style="{ aspectRatio: props.work.aspectRatio }">
            <video
              v-if="!isMediaUnavailable"
              ref="video"
              class="work-viewer__video"
              :src="props.work.videoSrc"
              :poster="props.work.posterSrc"
              controls
              playsinline
              preload="metadata"
              :aria-label="`${props.work.title}作品播放器`"
              @error="markMediaUnavailable"
            />
            <div v-else class="work-viewer__unavailable" role="status">
              <p>作品影片暫時無法播放</p>
              <span>請稍後再試。</span>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
