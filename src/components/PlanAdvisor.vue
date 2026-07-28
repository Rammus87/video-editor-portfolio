<script setup>
import { Icon } from '@iconify/vue'
import { computed, reactive, ref } from 'vue'
import { recommendPlan } from '../utils/recommendation'

const emit = defineEmits(['view-service', 'contact'])

const questions = [
  {
    key: 'platform',
    label: '預計發布平台',
    options: ['Instagram Reels', 'TikTok', 'YouTube Shorts', 'YouTube', 'Facebook', '其他'],
  },
  {
    key: 'length',
    label: '預計成片長度',
    options: ['30 秒', '60 秒', '3 分鐘內', '8 分鐘', '12 分鐘', '12 分鐘以上'],
  },
  {
    key: 'contentSupport',
    label: '是否需要內容協助',
    options: [
      { label: '已有完整文案，只需要剪輯', value: 'editing-only' },
      { label: '需要我協助調整文案或內容', value: 'content-optimization' },
    ],
  },
  {
    key: 'style',
    label: '影片風格',
    options: ['快節奏短影音', '字幕口播', '商品／品牌宣傳', 'Vlog', '訪談／教學', '故事型影片', '其他'],
  },
  {
    key: 'aerial',
    label: '是否需要航拍',
    options: [
      { label: '不需要', value: 'none' },
      { label: '需要航拍素材', value: 'shoot' },
      { label: '已有航拍素材，只需要剪輯', value: 'provided' },
    ],
  },
  {
    key: 'frequency',
    label: '製作頻率',
    options: [
      { label: '單次製作', value: 'one-time' },
      { label: '每月 1–3 支', value: 'monthly-1-3' },
      { label: '每月 4–8 支', value: 'monthly-4-8' },
      { label: '每月 8 支以上', value: 'monthly-8-plus' },
    ],
  },
]

const answers = reactive({ platform: '', length: '', contentSupport: '', style: '', aerial: '', frequency: '' })
const attempted = ref(false)
const result = ref(null)
const isOpen = ref(false)
const visibleQuestions = computed(() => questions.filter((question) => question.key !== 'contentSupport' || answers.length === '30 秒'))
const missingQuestion = computed(() => visibleQuestions.value.find((question) => !answers[question.key])?.label)
function optionValue(option) {
  return typeof option === 'string' ? option : option.value
}

function optionLabel(option) {
  return typeof option === 'string' ? option : option.label
}

function selectAnswer(key, option) {
  answers[key] = optionValue(option)
  result.value = null
}

function showRecommendation() {
  attempted.value = true
  if (missingQuestion.value) return
  result.value = recommendPlan({ ...answers })
}

function toggleAdvisor() {
  isOpen.value = !isOpen.value
}

</script>

<template>
  <section id="advisor" class="advisor-section section-space" :class="{ 'is-collapsed': !isOpen }" aria-labelledby="advisor-title">
    <div class="page-width advisor-layout">
      <div class="advisor-heading">
        <div>
          <p class="eyebrow">方案建議</p>
          <h2 id="advisor-title">不確定該怎麼選？</h2>
        </div>
        <button
          class="advisor-toggle"
          type="button"
          :aria-expanded="isOpen"
          aria-controls="advisor-content"
          :aria-label="isOpen ? '收合方案推薦問題' : '展開方案推薦問題'"
          @click="toggleAdvisor"
        >
          <Icon icon="solar:alt-arrow-down-linear" aria-hidden="true" />
        </button>
      </div>

      <Transition name="advisor-panel">
        <div v-if="isOpen" id="advisor-content" class="advisor-content">
          <p class="advisor-intro">回答幾個問題，我會提供較適合的方案建議。所有判斷只在這個頁面進行，不會送出或儲存資料。</p>
          <div class="advisor-tool">
            <div
              v-for="question in visibleQuestions"
              :key="question.key"
              class="advisor-question"
            >
              <p>{{ question.label }} <span aria-hidden="true">*</span></p>
              <div class="advisor-options" role="radiogroup" :aria-label="question.label">
                <button
                  v-for="option in question.options"
                  :key="optionValue(option)"
                  type="button"
                  class="advisor-option"
                  :class="{ 'is-active': answers[question.key] === optionValue(option) }"
                  role="radio"
                  :aria-checked="answers[question.key] === optionValue(option)"
                  @click="selectAnswer(question.key, option)"
                >
                  {{ optionLabel(option) }}
                </button>
              </div>
            </div>
            <p v-if="attempted && missingQuestion" class="advisor-error" role="alert">請先選擇「{{ missingQuestion }}」。</p>
            <button class="cta-button advisor-cta" type="button" @click="showRecommendation">查看建議方案 <Icon icon="solar:arrow-right-linear" aria-hidden="true" /></button>

            <Transition name="detail-reveal">
              <section v-if="result" class="recommendation-result" aria-live="polite" aria-labelledby="result-title">
                <p class="detail-kicker">適合你的方案</p>
                <h3 id="result-title">{{ result.service.title }}／{{ result.planName }}</h3>
                <p class="recommendation-reason">{{ result.reason }}</p>
                <div class="recommendation-summary">
                  <div><span>方案價格</span><b>{{ result.priceLabel }}</b></div>
                  <div><span>交付時間</span><b>{{ result.deliveryLabel }}</b></div>
                  <div><span>修改安排</span><b>{{ result.revisionLabel }}</b></div>
                  <div><span>長期合作</span><b>{{ result.suggestLongTerm ? '可參考每週合作方案' : '單次方案' }}</b></div>
                </div>
                <ul class="recommendation-content">
                  <li v-for="item in result.relatedContent" :key="item"><Icon icon="solar:check-circle-linear" aria-hidden="true" />{{ item }}</li>
                </ul>
                <div class="recommendation-actions">
                  <button type="button" class="text-button" @click="emit('view-service', result)">查看方案詳情 <Icon icon="solar:arrow-right-linear" aria-hidden="true" /></button>
                  <button type="button" class="text-button" @click="emit('contact')">聯絡我 <Icon icon="solar:arrow-right-linear" aria-hidden="true" /></button>
                </div>
              </section>
            </Transition>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>
