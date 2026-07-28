<script setup>
import { contactMethods } from '../data/contact'
</script>

<template>
  <footer class="app-footer">
    <div class="page-width footer-inner">
      <p>CINEMATIC EDITING DESK</p>
      <div>
        <a v-if="contactMethods[0]" :href="contactMethods[0].href" :target="contactMethods[0].external ? '_blank' : undefined" :rel="contactMethods[0].external ? 'noreferrer' : undefined">{{ contactMethods[0].label }}</a>
        <span>© 2026 All rights reserved.</span>
      </div>
    </div>
  </footer>
</template>
