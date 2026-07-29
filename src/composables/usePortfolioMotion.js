import { onBeforeUnmount, onMounted, ref } from 'vue'

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const DESKTOP_POINTER_QUERY = '(min-width: 901px)'

export function usePortfolioPointerGlow() {
  const glow = ref(null)
  let animationFrame
  let finePointerQuery
  let reducedMotionQuery
  let desktopPointerQuery
  let pointerListening = false
  let pointerX = 0
  let pointerY = 0

  function supportsPointerGlow() {
    return finePointerQuery?.matches && desktopPointerQuery?.matches && !reducedMotionQuery?.matches
  }

  function setVisible(isVisible) {
    glow.value?.classList.toggle('is-visible', isVisible)
  }

  function updateGlowPosition() {
    animationFrame = undefined
    if (!glow.value) return

    glow.value.style.setProperty('--portfolio-pointer-x', `${pointerX}px`)
    glow.value.style.setProperty('--portfolio-pointer-y', `${pointerY}px`)
    setVisible(true)
  }

  function handlePointerMove(event) {
    const target = event.target
    const isInPortfolioExperience = target instanceof Element && target.closest('[data-portfolio-experience]')

    if (!isInPortfolioExperience) {
      setVisible(false)
      return
    }

    pointerX = event.clientX
    pointerY = event.clientY

    if (!animationFrame) animationFrame = window.requestAnimationFrame(updateGlowPosition)
  }

  function stopPointerTracking() {
    if (!pointerListening) return
    document.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('blur', hideGlow)
    pointerListening = false
  }

  function hideGlow() {
    if (animationFrame) window.cancelAnimationFrame(animationFrame)
    animationFrame = undefined
    setVisible(false)
  }

  function syncPointerTracking() {
    if (supportsPointerGlow()) {
      if (pointerListening) return
      document.addEventListener('pointermove', handlePointerMove, { passive: true })
      window.addEventListener('blur', hideGlow)
      pointerListening = true
      return
    }

    stopPointerTracking()
    hideGlow()
  }

  onMounted(() => {
    finePointerQuery = window.matchMedia(FINE_POINTER_QUERY)
    reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    desktopPointerQuery = window.matchMedia(DESKTOP_POINTER_QUERY)
    finePointerQuery.addEventListener('change', syncPointerTracking)
    reducedMotionQuery.addEventListener('change', syncPointerTracking)
    desktopPointerQuery.addEventListener('change', syncPointerTracking)
    syncPointerTracking()
  })

  onBeforeUnmount(() => {
    stopPointerTracking()
    hideGlow()
    finePointerQuery?.removeEventListener('change', syncPointerTracking)
    reducedMotionQuery?.removeEventListener('change', syncPointerTracking)
    desktopPointerQuery?.removeEventListener('change', syncPointerTracking)
  })

  return { glow }
}

export function usePortfolioReveal() {
  const section = ref(null)
  const isMotionReady = ref(false)
  const isRevealed = ref(false)
  let observer

  function reveal() {
    isRevealed.value = true
    observer?.disconnect()
    observer = undefined
  }

  onMounted(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches || !('IntersectionObserver' in window) || !section.value) {
      reveal()
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal()
      },
      { threshold: 0.12 },
    )
    observer.observe(section.value)
    window.requestAnimationFrame(() => {
      isMotionReady.value = true
    })
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { section, isMotionReady, isRevealed }
}
