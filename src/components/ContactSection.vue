<script setup>
import { Icon } from '@iconify/vue'
import { contactMethods } from '../data/contact'
</script>

<template>
  <section id="contact" class="contact-section section-space" aria-labelledby="contact-title">
    <div class="page-width contact-simple">
      <div class="contact-copy">
        <p class="eyebrow">聯絡我</p>
        <h2 id="contact-title">聯絡我</h2>
        <p>想確認方案、時程或報價，歡迎透過以下方式聯絡我。</p>
      </div>
      <div v-if="contactMethods.length" class="contact-actions">
        <a
          class="cta-button"
          :href="contactMethods[0].href"
          :target="contactMethods[0].external ? '_blank' : undefined"
          :rel="contactMethods[0].external ? 'noreferrer' : undefined"
        >
          聯絡我 <Icon icon="solar:arrow-right-linear" aria-hidden="true" />
        </a>
        <div class="contact-methods contact-methods-simple">
          <a
            v-for="method in contactMethods"
            :key="method.id"
            :href="method.href"
            :target="method.external ? '_blank' : undefined"
            :rel="method.external ? 'noreferrer' : undefined"
          >
            <Icon :icon="method.icon" aria-hidden="true" />
            <span>{{ method.label }}</span>
            <b>{{ method.value }}</b>
            <Icon class="contact-arrow" icon="solar:arrow-right-linear" aria-hidden="true" />
          </a>
        </div>
      </div>
      <p v-else class="contact-unavailable">目前尚未設定聯絡方式。</p>
    </div>
  </section>
</template>
