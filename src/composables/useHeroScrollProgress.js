import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useHeroScrollProgress(target, { startAt = 0.58 } = {}) {
  const progress = ref(0)
  let frame
  let start = 0
  let end = 0
  let reducedMotion = false

  const measure = () => {
    const element = target.value
    if (!element) return
    start = element.offsetTop + element.offsetHeight * startAt
    end = element.offsetTop + element.offsetHeight
  }

  const setProgress = () => {
    frame = undefined
    const next = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)))
    if (next !== progress.value) progress.value = next
  }

  const handleScroll = () => {
    if (reducedMotion) return
    const scrollY = window.scrollY

    if (scrollY <= start) {
      if (progress.value !== 0) progress.value = 0
      return
    }

    if (scrollY >= end) {
      if (progress.value !== 1) progress.value = 1
      return
    }

    if (!frame) frame = window.requestAnimationFrame(setProgress)
  }

  onMounted(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    measure()
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
  })

  onBeforeUnmount(() => {
    if (frame) window.cancelAnimationFrame(frame)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', measure)
  })

  return { progress }
}
