import { getPlanPriceLabel, getServiceById } from '../data/services.js'

const frequentProduction = new Set(['monthly-4-8', 'monthly-8-plus'])
const longTierByLength = {
  '8 分鐘': '8m',
  '12 分鐘': '12m',
  '12 分鐘以上': 'over-12m',
}

function recommendationServiceId({ length, aerial }) {
  if (aerial !== 'none') return 'aerial'
  return ['30 秒', '60 秒', '3 分鐘內'].includes(length) ? 'short' : 'long'
}

function tierForRecommendation(service, { length, aerial, contentSupport }) {
  if (service.id === 'aerial') return service.tiers.find((tier) => tier.id === 'more-duration')

  if (service.id === 'short') {
    if (length === '30 秒') return service.tiers.find((tier) => tier.id === (contentSupport === 'editing-only' ? '30s-basic' : '30s-optimized'))
    if (length === '60 秒') return service.tiers.find((tier) => tier.id === '60s-optimized')
    return service.tiers.find((tier) => tier.id === 'under-3m')
  }

  return service.tiers.find((tier) => tier.id === longTierByLength[length]) ?? service.tiers[0]
}

function createReason({ platform, length, style, aerial, service }) {
  const platformText = platform || '你選擇的發布平台'
  const styleText = style || '內容風格'

  if (aerial !== 'none') {
    return '這次需要航拍素材，我會建議選擇「航拍素材」。實際拍攝與剪輯方向會依發布平台、地點與影片風格確認。'
  }

  return `以你選擇的 ${platformText}、${length} 成片與 ${styleText} 來看，我會建議選擇「${service.title}」。`
}

export function recommendPlan(answers) {
  const service = getServiceById(recommendationServiceId(answers))
  const tier = tierForRecommendation(service, answers)
  const suggestLongTerm = frequentProduction.has(answers.frequency) && service.longTermPlans.length > 0

  return {
    serviceId: service.id,
    service,
    tier,
    planName: `${tier.duration}｜${tier.variant}`,
    suggestLongTerm,
    reason: createReason({ ...answers, service }),
    relatedContent: tier.included,
    deliveryLabel: tier.deliveryLabel,
    priceLabel: getPlanPriceLabel(tier),
    revisionLabel: service.cooperation.revisionPolicy.label,
  }
}
