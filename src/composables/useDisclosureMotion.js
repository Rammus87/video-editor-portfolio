import { onBeforeUnmount, onMounted } from 'vue'

export function useDisclosureMotion() {
  const running = new Map()
  const interrupted = new WeakMap()
  let motionQuery

  function cancel(element) {
    const record = running.get(element)
    if (!record) return
    const height = element.getBoundingClientRect().height
    const opacity = getComputedStyle(element).opacity
    interrupted.set(element, { height, opacity })
    element.style.height = `${height}px`
    record.animation.cancel()
    running.delete(element)
  }

  function animate(element, done, opening) {
    cancel(element)
    element.inert = !opening
    if (opening) element.removeAttribute('aria-hidden')
    else element.setAttribute('aria-hidden', 'true')
    const resume = interrupted.get(element)
    interrupted.delete(element)
    const target = opening ? element.scrollHeight : 0
    const start = resume?.height ?? (opening ? 0 : element.getBoundingClientRect().height)
    const opacity = resume?.opacity ?? (opening ? 0 : 1)
    element.style.removeProperty('height')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      done()
      return
    }
    const animation = element.animate([
      { height: `${start}px`, opacity },
      { height: `${target}px`, opacity: opening ? 1 : 0 },
    ], { duration: opening ? 360 : 300, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'both' })
    const finish = () => {
      if (running.get(element)?.animation !== animation) return
      running.delete(element)
      element.style.removeProperty('height')
      done()
      animation.cancel()
    }
    running.set(element, { animation, finish })
    animation.onfinish = finish
  }

  const enter = (element, done) => animate(element, done, true)
  const leave = (element, done) => animate(element, done, false)
  const syncPreference = () => {
    if (motionQuery.matches) [...running.values()].forEach(record => record.finish())
  }
  onMounted(() => {
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', syncPreference)
  })
  onBeforeUnmount(() => {
    running.forEach(record => record.animation.cancel())
    running.clear()
    motionQuery?.removeEventListener('change', syncPreference)
  })
  return { enter, leave, cancel }
}
