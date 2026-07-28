<script setup>
const navItems = [
  { label: '作品', target: 'works', current: true },
  { label: '服務與價格', target: 'services' },
  { label: '方案建議', target: 'advisor' },
  { label: '聯絡我', target: 'contact' },
]
</script>

<template>
  <header class="app-header">
    <a class="brand" href="#top" aria-label="回到頁面頂端">
      CINEMATIC EDITING DESK
    </a>
    <nav aria-label="主選單">
      <a
        v-for="item in navItems"
        :key="item.target"
        :href="`#${item.target}`"
        :class="{ 'is-current': item.current }"
        :aria-current="item.current ? 'page' : undefined"
      >
        {{ item.label }}
      </a>
    </nav>
  </header>
</template>
