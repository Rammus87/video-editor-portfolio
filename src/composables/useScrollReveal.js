import { onBeforeUnmount, onMounted } from 'vue'

export function useScrollReveal({ rootMargin = '0px 0px -20% 0px', threshold = 0.01 } = {}) {
  const targets = new Set()
  let observer
  let reducedMotion = false

  const reveal = (element) => {
    element.classList.add('is-revealed')
  }

  const revealRef = (element) => {
    if (!element || targets.has(element)) return
    targets.add(element)

    if (reducedMotion) {
      reveal(element)
    } else if (observer) {
      observer.observe(element)
    }
  }

  onMounted(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(reveal)
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          reveal(entry.target)
          observer.unobserve(entry.target)
        })
      },
      { rootMargin, threshold },
    )

    targets.forEach((element) => observer.observe(element))
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { revealRef }
}
