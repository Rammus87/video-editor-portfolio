<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const navItems = [
  { label: '主頁', target: 'home' },
  { label: '報價', target: 'pricing' },
  { label: '作品', target: 'works' },
]

const header = ref(null)
const activeTarget = ref('home')
const isOverHero = ref(true)
const visibility = new Map()
let observer
let heroObserver

function setActive(target) {
  activeTarget.value = target
}

function syncActiveTarget() {
  const target = [...visibility.entries()]
    .filter(([, ratio]) => ratio > 0)
    .sort((first, second) => second[1] - first[1])[0]?.[0]

  if (target) setActive(target)
}

function handleIntersections(entries) {
  entries.forEach((entry) => {
    visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
  })
  syncActiveTarget()
}

function observeSections() {
  observer?.disconnect()
  visibility.clear()

  const headerHeight = Math.ceil(header.value?.getBoundingClientRect().height || 0)
  observer = new IntersectionObserver(handleIntersections, {
    rootMargin: `-${headerHeight}px 0px -48% 0px`,
    threshold: [0, 0.01, 0.25, 0.5, 0.75],
  })

  navItems.forEach(({ target }) => {
    const section = document.getElementById(target)
    if (section) observer.observe(section)
  })
}

function handleResize() {
  observeSections()
}

function observeHero() {
  heroObserver?.disconnect()

  const hero = document.getElementById('home')
  if (!hero) return

  heroObserver = new IntersectionObserver(
    ([entry]) => {
      isOverHero.value = entry.isIntersecting
    },
    { threshold: 0 },
  )
  heroObserver.observe(hero)
}

onMounted(async () => {
  await nextTick()
  const hashTarget = window.location.hash.slice(1)
  if (navItems.some(({ target }) => target === hashTarget)) setActive(hashTarget)

  if (!('IntersectionObserver' in window)) return

  observeSections()
  observeHero()
  window.addEventListener('resize', handleResize, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  heroObserver?.disconnect()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <header ref="header" class="app-header" :class="{ 'is-scrolled': !isOverHero }">
    <div class="app-header-inner page-width">
      <a class="brand" href="#home" aria-label="回到主頁">
        個人影片剪輯
      </a>
      <nav aria-label="主選單">
        <a
          v-for="item in navItems"
          :key="item.target"
          :href="`#${item.target}`"
          :class="{ 'is-current': item.target === activeTarget }"
          :aria-current="item.target === activeTarget ? 'location' : undefined"
          @click="setActive(item.target)"
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
  </header>
</template>
