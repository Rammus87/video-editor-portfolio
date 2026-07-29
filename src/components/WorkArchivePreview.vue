<script setup>
import { featuredWorks } from '../data/works'

function scrollToWork(event, anchorId) {
  event.preventDefault()

  const target = document.getElementById(anchorId)
  if (!target) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
  window.history.replaceState(null, '', `#${anchorId}`)
}
</script>

<template>
  <section class="work-archive-preview archive-section" aria-labelledby="work-archive-title">
    <div class="page-width archive-layout">
      <header class="archive-heading">
        <p class="archive-kicker"><span class="archive-index">02</span><span>Work Archive</span></p>
        <h2 id="work-archive-title">作品目錄</h2>
      </header>

      <ol class="work-category-list" aria-label="作品目錄">
        <li v-for="work in featuredWorks" :key="work.id" class="work-category">
          <span class="work-category-index">{{ String(work.featuredOrder).padStart(2, '0') }}</span>
          <a
            class="work-archive-link"
            :href="`#${work.anchorId}`"
            @click="scrollToWork($event, work.anchorId)"
            @keydown.enter.prevent="scrollToWork($event, work.anchorId)"
          >
            <span>{{ work.category }}</span>
            <h3>{{ work.title }}</h3>
          </a>
          <div class="work-category-note">
            <span>負責：{{ work.responsibilities.join('、') }}</span>
            <span>{{ work.duration }}</span>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>
