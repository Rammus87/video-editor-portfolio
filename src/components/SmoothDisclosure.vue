<script setup>
import { useDisclosureMotion } from '../composables/useDisclosureMotion'
defineProps({ open: { type: Boolean, required: true } })
const { enter, leave, cancel } = useDisclosureMotion()
</script>

<template>
  <Transition :css="false" @enter="enter" @leave="leave" @enter-cancelled="cancel" @leave-cancelled="cancel">
    <div v-show="open" class="smooth-disclosure" :inert="!open" :aria-hidden="!open ? 'true' : undefined">
      <div class="smooth-disclosure__inner"><slot /></div>
    </div>
  </Transition>
</template>
