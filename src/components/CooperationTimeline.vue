<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  serviceId: { type: String, required: true },
  steps: { type: Array, required: true },
  phases: { type: Array, required: true },
  conclusion: { type: String, default: '' },
})

const timeline = ref(null)
const reducedMotion = ref(false)
const timelineStarted = ref(false)
const visiblePhases = ref([])
const visibleNodes = ref([])
const visibleContents = ref([])
const visibleConnectors = ref([])
const visibleCheckpoints = ref([])
const isConclusionDividerVisible = ref(false)
const isConclusionVisible = ref(false)

const timing = {
  phase: 160,
  node: 180,
  content: 220,
  connector: 250,
  checkpoint: 180,
  conclusionPause: 150,
  conclusionDivider: 250,
  conclusion: 280,
}

let observer
let startTimer
let sequenceTimer
let runId = 0

const phaseMap = computed(() => new Map(props.phases.map((phase) => [phase.id, phase])))
const initialPhase = computed(() => props.phases[0])

function includes(list, value) {
  return list.value.includes(value)
}

function addVisible(list, value) {
  if (!list.value.includes(value)) list.value = [...list.value, value]
}

function clearPendingAnimation() {
  if (startTimer) window.clearTimeout(startTimer)
  if (sequenceTimer) window.clearTimeout(sequenceTimer)
  startTimer = undefined
  sequenceTimer = undefined
}

function disconnectObserver() {
  observer?.disconnect()
  observer = undefined
}

function resetTimeline() {
  timelineStarted.value = false
  visiblePhases.value = []
  visibleNodes.value = []
  visibleContents.value = []
  visibleConnectors.value = []
  visibleCheckpoints.value = []
  isConclusionDividerVisible.value = false
  isConclusionVisible.value = false
}

function phaseForStep(step) {
  return phaseMap.value.get(step.phase)
}

function nextPhaseAfter(index) {
  const current = props.steps[index]
  const next = props.steps[index + 1]

  if (!next || next.phase === current.phase) return null
  return phaseForStep(next)
}

function buildSequence() {
  const events = []
  const firstPhase = initialPhase.value

  if (firstPhase) events.push({ type: 'phase', phaseId: firstPhase.id })

  props.steps.forEach((step, index) => {
    events.push({ type: 'node', index })
    events.push({ type: 'content', index })

    if (index === props.steps.length - 1) return

    const nextPhase = nextPhaseAfter(index)
    const currentPhase = phaseForStep(step)
    if (nextPhase) {
      if (currentPhase?.checkpointLabel) events.push({ type: 'checkpoint', phaseId: currentPhase.id })
      events.push({ type: 'phase', phaseId: nextPhase.id })
    }

    events.push({ type: 'connector', index })
  })

  if (props.conclusion) {
    events.push({ type: 'conclusionDivider' })
    events.push({ type: 'conclusion' })
  }

  return events
}

function revealEvent(event) {
  if (event.type === 'phase') addVisible(visiblePhases, event.phaseId)
  if (event.type === 'node') addVisible(visibleNodes, event.index)
  if (event.type === 'content') addVisible(visibleContents, event.index)
  if (event.type === 'connector') addVisible(visibleConnectors, event.index)
  if (event.type === 'checkpoint') addVisible(visibleCheckpoints, event.phaseId)
  if (event.type === 'conclusionDivider') isConclusionDividerVisible.value = true
  if (event.type === 'conclusion') isConclusionVisible.value = true
}

function revealEverything() {
  timelineStarted.value = true
  visiblePhases.value = props.phases.map((phase) => phase.id)
  visibleNodes.value = props.steps.map((_, index) => index)
  visibleContents.value = props.steps.map((_, index) => index)
  visibleConnectors.value = props.steps.slice(0, -1).map((_, index) => index)
  visibleCheckpoints.value = props.phases.filter((phase) => phase.checkpointLabel).map((phase) => phase.id)
  isConclusionDividerVisible.value = Boolean(props.conclusion)
  isConclusionVisible.value = Boolean(props.conclusion)
}

function playSequence(currentRun) {
  const events = buildSequence()
  let eventIndex = 0

  function revealNext() {
    if (currentRun !== runId) return

    const event = events[eventIndex]
    if (!event) return

    revealEvent(event)
    eventIndex += 1

    const nextEvent = events[eventIndex]
    if (!nextEvent) return

    const delay = event.type === 'content' && nextEvent.type === 'conclusionDivider'
      ? timing.content + timing.conclusionPause
      : timing[event.type]
    sequenceTimer = window.setTimeout(revealNext, delay)
  }

  revealNext()
}

function startTimeline(currentRun) {
  if (timelineStarted.value || reducedMotion.value || startTimer) return

  startTimer = window.setTimeout(() => {
    startTimer = undefined
    if (currentRun !== runId) return

    timelineStarted.value = true
    disconnectObserver()
    playSequence(currentRun)
  }, 260)
}

async function prepareTimeline() {
  const currentRun = ++runId
  clearPendingAnimation()
  disconnectObserver()
  resetTimeline()

  await nextTick()
  if (currentRun !== runId) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reducedMotion.value = true
    revealEverything()
    return
  }

  reducedMotion.value = false
  if (!timeline.value || !('IntersectionObserver' in window)) {
    startTimeline(currentRun)
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) startTimeline(currentRun)
    },
    { rootMargin: '0px 0px -20% 0px', threshold: 0 },
  )
  observer.observe(timeline.value)
}

function isPhaseVisible(phaseId) {
  return includes(visiblePhases, phaseId)
}

function isNodeVisible(index) {
  return includes(visibleNodes, index)
}

function isContentVisible(index) {
  return includes(visibleContents, index)
}

function isConnectorVisible(index) {
  return includes(visibleConnectors, index)
}

function isCheckpointVisible(phaseId) {
  return includes(visibleCheckpoints, phaseId)
}

onMounted(prepareTimeline)
watch([() => props.serviceId, () => props.steps, () => props.phases, () => props.conclusion], prepareTimeline)
onBeforeUnmount(() => {
  runId += 1
  clearPendingAnimation()
  disconnectObserver()
})
</script>

<template>
  <div
    ref="timeline"
    class="cooperation-timeline"
    :class="{ 'is-started': timelineStarted, 'is-reduced-motion': reducedMotion }"
  >
    <div
      class="timeline-phase-heading"
      :class="{ 'is-visible': initialPhase && isPhaseVisible(initialPhase.id) }"
    >
      <span>{{ initialPhase?.label }}</span>
      <strong>{{ initialPhase?.title }}</strong>
    </div>

    <ol class="timeline-steps">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        class="timeline-step"
        :class="[
          `timeline-step--${step.phase}`,
          {
            'is-node-visible': isNodeVisible(index),
            'is-content-visible': isContentVisible(index),
            'timeline-step--has-next': index < steps.length - 1,
            'timeline-step--phase-transition': nextPhaseAfter(index),
          },
        ]"
        :aria-hidden="!isContentVisible(index)"
      >
        <div class="timeline-rail" aria-hidden="true">
          <span class="timeline-node">{{ String(index + 1).padStart(2, '0') }}</span>
          <span
            v-if="index < steps.length - 1"
            class="timeline-connector"
            :class="{ 'is-visible': isConnectorVisible(index) }"
          ></span>
        </div>

        <div class="timeline-content">
          <h4>{{ step.title }}</h4>
          <span v-if="step.timeLabel" class="timeline-step-label">{{ step.timeLabel }}</span>
          <p>{{ step.description }}</p>

          <template v-if="nextPhaseAfter(index)">
            <div
              v-if="phaseForStep(step)?.checkpointLabel"
              class="timeline-checkpoint"
              :class="{ 'is-visible': isCheckpointVisible(step.phase) }"
            >
              <span class="timeline-checkpoint-mark" aria-hidden="true">✓</span>
              <span>{{ phaseForStep(step).checkpointLabel }}</span>
            </div>

            <div
              class="timeline-phase-heading timeline-phase-heading--transition"
              :class="{ 'is-visible': isPhaseVisible(nextPhaseAfter(index).id) }"
            >
              <span>{{ nextPhaseAfter(index).label }}</span>
              <strong>{{ nextPhaseAfter(index).title }}</strong>
            </div>
          </template>
        </div>
      </li>
    </ol>

    <div
      class="workflow-conclusion"
      :class="{
        'is-divider-visible': isConclusionDividerVisible,
        'is-visible': isConclusionVisible,
      }"
      aria-live="polite"
      :aria-hidden="!isConclusionVisible"
    >
      <div class="workflow-conclusion__divider" aria-hidden="true"></div>
      <p class="workflow-conclusion__copy">{{ conclusion }}</p>
    </div>
  </div>
</template>
