<script setup>
const navItems = [
  { label: '服務與價格', target: 'services' },
  { label: '方案建議', target: 'advisor' },
  { label: '聯絡我', target: 'contact' },
]

function goTo(target) {
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <header class="app-header">
    <button class="brand" type="button" aria-label="回到頁面頂端" @click="goTo('top')">
      CINEMATIC EDITING DESK
    </button>
    <nav aria-label="主選單">
      <button v-for="item in navItems" :key="item.target" type="button" @click="goTo(item.target)">
        {{ item.label }}
      </button>
    </nav>
  </header>
</template>
