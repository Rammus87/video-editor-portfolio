const shortBasicIncluded = [
  '素材初步整理',
  '基礎剪輯',
  '基本字幕編排',
  '基本調色',
  '音樂與音量處理',
  '依發布平台輸出 1080p MP4',
]

const shortBasicExcluded = [
  '文案撰寫或修改',
  '內容結構優化',
  '進階節奏調整',
]

const shortOptimizedIncluded = [
  '基礎剪輯',
  '文案調整',
  '內容結構優化',
  '影片節奏調整',
  '字幕編排',
  '基本調色',
  '音樂與音量處理',
  '依發布平台輸出 1080p MP4',
]

const longVideoIncluded = [
  '文案調整',
  '內容結構優化',
  '影片節奏調整',
  '完整剪輯',
  '字幕編排',
  '基本調色',
  '音樂與音量處理',
  '封面標題規劃',
  '1080p MP4 輸出',
]

const aerialIncluded = [
  '航拍素材拍攝與基本畫面篩選',
  '基礎剪輯、色彩調整與片段整合',
  '1080p MP4 成片',
]

const revisionPolicy = {
  label: '修改至滿意',
  description: '依照你的回饋調整內容、節奏與畫面細節，確認滿意後再交付。',
  note: '修改至滿意適用於合作前確認的素材、內容方向與成片規格；若中途更換主題、新增大量素材或改變成片規格，將重新確認費用與排程。',
}

const editingWorkflowPhases = [
  { id: 'draft', label: '階段一', title: '需求確認與初稿製作', checkpointLabel: '初稿完成' },
  { id: 'revision', label: '階段二', title: '修改與完成交付' },
]

const aerialWorkflowPhases = [
  { id: 'draft', label: '階段一', title: '拍攝與初稿製作', checkpointLabel: '初稿完成' },
  { id: 'revision', label: '階段二', title: '修改與完成交付' },
]

export const services = [
  {
    id: 'short',
    number: '01',
    title: '短片',
    startingPrice: 300,
    icon: 'solar:clapperboard-linear',
    hoverCopy: 'Reels、Shorts、活動精華，適合節奏明快的短影音內容。',
    description: '短影音、Reels 與活動精華，節奏明快而不失品牌質感。',
    tiers: [
      {
        id: '30s-basic',
        duration: '30 秒內',
        variant: '簡單剪輯',
        price: 300,
        summary: '適合已有完整文案、內容方向和影片節奏，只需要進行基本剪輯。',
        included: shortBasicIncluded,
        excluded: shortBasicExcluded,
        deliveryTime: '24 小時內',
        deliveryLabel: '初稿：24 小時內',
        draftDeliveryTime: '24 小時內',
      },
      {
        id: '30s-optimized',
        duration: '30 秒內',
        variant: '內容優化',
        price: 400,
        summary: '適合需要一起調整文案、內容結構與影片節奏的短影音。',
        included: shortOptimizedIncluded,
        excluded: [],
        deliveryTime: '24 小時內',
        deliveryLabel: '初稿：24 小時內',
        draftDeliveryTime: '24 小時內',
      },
      {
        id: '60s-optimized',
        duration: '60 秒內',
        variant: '內容優化',
        price: 500,
        summary: '適合需要內容優化與清楚節奏安排的 60 秒短影音。',
        included: shortOptimizedIncluded,
        excluded: [],
        deliveryTime: '24 小時內',
        deliveryLabel: '初稿：24 小時內',
        draftDeliveryTime: '24 小時內',
      },
      {
        id: 'under-3m',
        duration: '3 分鐘內',
        variant: '完整內容優化',
        price: null,
        pricePending: true,
        summary: '適合需要文案與內容優化、節奏調整的 3 分鐘內短片。',
        included: shortOptimizedIncluded,
        excluded: [],
        deliveryTime: '2 個工作天內',
        deliveryLabel: '初稿：2 個工作天內',
        draftDeliveryTime: '2 個工作天內',
      },
    ],
    cooperation: {
      title: '短片合作流程',
      revisionPolicy,
      phases: editingWorkflowPhases,
      steps: [
        {
          id: 'brief',
          phase: 'draft',
          title: '確認需求',
          description: '確認發布平台、成片長度、影片風格、參考方向與交付時間。',
        },
        {
          id: 'materials',
          phase: 'draft',
          title: '提供素材',
          description: '提供原始影片、腳本、品牌素材與參考案例；收到後會先確認素材是否齊全。',
        },
        {
          id: 'direction',
          phase: 'draft',
          title: '剪輯方向討論',
          description: '依照內容目標確認剪輯節奏、字幕呈現與畫面重點。',
        },
        {
          id: 'draft',
          phase: 'draft',
          title: '初稿確認',
          description: '完成初稿後提供雲端預覽，確認內容、節奏與畫面方向。',
        },
        {
          id: 'revision',
          phase: 'revision',
          title: revisionPolicy.label,
          description: revisionPolicy.description,
          timeLabel: revisionPolicy.label,
        },
        {
          id: 'delivery',
          phase: 'revision',
          title: '完成交付',
          description: '確認成片後，依約定格式完成交付。',
        },
      ],
    },
    longTermTitle: '短片長期合作',
    longTermDescription: '合作前，我會和你確認排程、每週數量與素材提供方式。',
    longTermPlans: [
      { quantity: 20, period: '每週', price: 3000 },
      { quantity: 40, period: '每週', price: 5000 },
    ],
  },
  {
    id: 'long',
    number: '02',
    title: '長片',
    startingPrice: 1500,
    icon: 'solar:film-reel-linear',
    hoverCopy: 'YouTube、訪談與 Vlog，整理內容結構與觀看節奏。',
    description: '訪談、YouTube、品牌紀錄與活動影片，保留內容的起伏與重點。',
    tiers: [
      {
        id: '8m',
        duration: '8 分鐘內',
        variant: '完整剪輯',
        price: 1500,
        summary: '適合需要完整內容結構、節奏與上架準備的長片。',
        included: longVideoIncluded,
        excluded: [],
        deliveryTime: '5 個工作天',
        deliveryLabel: '5 個工作天',
        deliveryBreakdown: '初稿 4 天＋調整 1 天',
        draftDeliveryTime: '4 個工作天內',
      },
      {
        id: '12m',
        duration: '12 分鐘內',
        variant: '完整剪輯',
        price: 2000,
        summary: '適合需要更完整敘事與節奏安排的內容型長片。',
        included: longVideoIncluded,
        excluded: [],
        deliveryTime: '7 個工作天',
        deliveryLabel: '7 個工作天',
        deliveryBreakdown: '初稿 6 天＋調整 1 天',
        draftDeliveryTime: '6 個工作天內',
      },
      {
        id: 'over-12m',
        duration: '12 分鐘以上',
        variant: '依專案規劃',
        price: null,
        priceQuote: true,
        summary: '影片長度、原始素材量和內容複雜度差異較大，確認需求後提供報價與交付時間。',
        included: longVideoIncluded,
        excluded: [],
        deliveryTime: '確認需求後提供交付時間',
        deliveryLabel: '確認需求後提供交付時間',
        draftDeliveryTime: '依確認排程',
      },
    ],
    cooperation: {
      title: '長片合作流程',
      revisionPolicy,
      phases: editingWorkflowPhases,
      steps: [
        {
          id: 'brief',
          phase: 'draft',
          title: '確認需求',
          description: '確認影片主題、發布平台、成片長度、內容架構與交付時間。',
        },
        {
          id: 'materials',
          phase: 'draft',
          title: '提供素材',
          description: '提供原始影片、腳本、品牌素材與參考資料；收到後會先確認內容是否齊全。',
        },
        {
          id: 'direction',
          phase: 'draft',
          title: '剪輯方向討論',
          description: '依照內容架構確認敘事順序、剪輯節奏、字幕與畫面重點。',
        },
        {
          id: 'draft',
          phase: 'draft',
          title: '初稿確認',
          description: '完成初稿後提供雲端預覽，確認敘事、節奏與字幕重點。',
        },
        {
          id: 'revision',
          phase: 'revision',
          title: revisionPolicy.label,
          description: revisionPolicy.description,
          timeLabel: revisionPolicy.label,
        },
        {
          id: 'delivery',
          phase: 'revision',
          title: '完成交付',
          description: '確認成片後，依約定格式完成交付。',
        },
      ],
    },
    longTermPlans: [],
  },
  {
    id: 'aerial',
    number: '03',
    title: '航拍素材',
    startingPrice: 1000,
    cardPriceNote: '車馬費另計；基礎剪輯後成片每 5 分鐘 NT$1,000',
    icon: 'solar:drone-outline',
    hoverCopy: '現場航拍搭配基礎後製，補足地景、建築與空間畫面。',
    description: '依場地與天候安排航拍，搭配基礎剪輯完成可直接使用的畫面。',
    pricingFormula: {
      title: '航拍費用試算',
      headline: '車馬費＋每 5 分鐘 NT$1,000',
      travelFeeLabel: '車馬費另計，依拍攝地點確認。',
      unitMinutes: 5,
      pricePerUnit: 1000,
      examples: [
        { minutes: 5, durationUnits: 1 },
        { minutes: 10, durationUnits: 2 },
        { minutes: 15, durationUnits: 3 },
      ],
    },
    tiers: [
      {
        id: 'under-5m',
        duration: '成片 5 分鐘',
        variant: '基礎剪輯',
        price: 1000,
        priceLabel: '車馬費＋NT$1,000',
        summary: '適合完成 5 分鐘航拍成片的拍攝與基礎剪輯安排。',
        included: aerialIncluded,
        excluded: [],
        deliveryTime: '一般 2–5 個工作天',
        deliveryLabel: '一般 2–5 個工作天',
        draftDeliveryTime: '依成片長度確認',
      },
      {
        id: 'under-10m',
        duration: '成片 10 分鐘',
        variant: '基礎剪輯',
        price: 2000,
        priceLabel: '車馬費＋NT$2,000',
        summary: '適合完成 10 分鐘航拍成片的拍攝與基礎剪輯安排。',
        included: aerialIncluded,
        excluded: [],
        deliveryTime: '一般 2–5 個工作天',
        deliveryLabel: '一般 2–5 個工作天',
        draftDeliveryTime: '依成片長度確認',
      },
      {
        id: 'more-duration',
        duration: '依需求討論',
        variant: '按 5 分鐘計價',
        price: 1000,
        priceLabel: '車馬費＋每 5 分鐘 NT$1,000',
        summary: '每增加 5 分鐘成片，基礎剪輯費增加 NT$1,000；車馬費依拍攝地點確認。',
        included: aerialIncluded,
        excluded: [],
        deliveryTime: '一般 2–5 個工作天',
        deliveryLabel: '一般 2–5 個工作天',
        draftDeliveryTime: '依成片長度確認',
      },
    ],
    cooperation: {
      title: '航拍素材合作流程',
      revisionPolicy,
      phases: aerialWorkflowPhases,
      steps: [
        {
          id: 'location',
          phase: 'draft',
          title: '確認地點與日期',
          description: '確認拍攝地點、日期、成片方向與現場條件。',
        },
        {
          id: 'conditions',
          phase: 'draft',
          title: '評估天候與交通',
          description: '依照天候、交通與飛行條件確認拍攝安排。',
        },
        {
          id: 'direction',
          phase: 'draft',
          title: '確認拍攝方向',
          description: '確認拍攝視角、畫面重點與需要避開的區域。',
        },
        {
          id: 'filming',
          phase: 'draft',
          title: '現場拍攝',
          description: '依照確認的安排進行航拍，保留適合後續剪輯的畫面。',
        },
        {
          id: 'draft',
          phase: 'draft',
          title: '素材整理與初稿',
          description: '整理拍攝素材並完成初稿，提供雲端預覽確認畫面與剪輯方向。',
        },
        {
          id: 'revision',
          phase: 'revision',
          title: revisionPolicy.label,
          description: revisionPolicy.description,
          timeLabel: revisionPolicy.label,
        },
        {
          id: 'delivery',
          phase: 'revision',
          title: '完成交付',
          description: '確認成片後，依約定格式完成交付。',
        },
      ],
    },
    longTermPlans: [],
  },
]

const currency = new Intl.NumberFormat('zh-TW')

export function formatCurrency(value) {
  return `NT$${currency.format(value)}`
}

export function getPlanPriceLabel(tier) {
  if (tier.pricePending) return '價格設定中'
  if (tier.priceQuote) return '另行報價'
  return tier.priceLabel ?? formatCurrency(tier.price)
}

export function getServiceById(id) {
  return services.find((service) => service.id === id)
}
