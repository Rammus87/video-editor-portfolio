<script setup>
import { computed } from 'vue'
import bilibiliSvg from '../assets/icons/platforms/bilibili.svg?raw'
import instagramSvg from '../assets/icons/platforms/instagram.svg?raw'
import tiktokSvg from '../assets/icons/platforms/tiktok.svg?raw'
import youtubeShortsSvg from '../assets/icons/platforms/youtube-shorts.svg?raw'
import youtubeSvg from '../assets/icons/platforms/youtube.svg?raw'

const props = defineProps({
  platform: { type: String, required: true },
})

const platformSvgs = {
  shorts: youtubeShortsSvg,
  youtube: youtubeSvg,
  instagram: instagramSvg,
  tiktok: tiktokSvg,
  bilibili: bilibiliSvg,
}

const iconMarkup = computed(() => platformSvgs[props.platform] ?? '')
</script>

<template>
  <span
    class="platform-icon"
    :class="`platform-icon--${platform}`"
    aria-hidden="true"
    v-html="iconMarkup"
  />
</template>
