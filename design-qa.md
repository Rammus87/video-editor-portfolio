# 2026-11-04 — 航拍金額字級統一

預計／實際修改：`src/components/ServiceSelector.vue`、`src/refinement.css`、`design-qa.md`。
航拍主金額使用共用貨幣格式與字級，不將車馬費前綴一起縮小。保留下方車馬費說明；依需求討論顯示小字／每5分鐘。原始價格資料與完整方案不變。

| Self-check | 結果 | 證據 |
|---|---|---|
| 手機三類字級 | PASS | 390×844 剪輯／航拍／AICG皆52px |
| 桌面三類字級 | PASS | 1440×900 三類皆82px |
| 平板 | PASS | 768×1024 航拍52px，overflow=false |
| 航拍價格與條件 | PASS | 5分鐘1000、10分鐘2000、依需求1000／每5分鐘；三者均保留車馬費另計 |
| 水平溢出／Console | PASS | 已測尺寸overflow=false，error logs=[] |
| build / git diff --check | PASS | exit0 |
| 鍵盤／reduced-motion／實體手機 | NOT_TESTED | 本輪未改互動邏輯 |

URL http://127.0.0.1:5173/#pricing；截圖 `/private/tmp/portfolio-directory/aerial-price-mobile.png`。主金額為基礎剪輯費，車馬費仍須另計。
建議 commit message: `fix: unify aerial price typography`。沒有 commit、push 或部署。等待驗收。

---

# 2026-11-04 — AICG 費用包含範圍

預計／實際修改：`src/data/services.js`、`design-qa.md`。
依使用者明確提供的服務範圍更新 AICG description：以上費用包含：前期討論、劇本、資產圖、生成、剪輯。摘要及完整方案共用資料；價格與規格未改。

| Self-check | 結果 | 證據 |
|---|---|---|
| 手機摘要 | PASS | 390×844，完整五項文字；clientHeight=scrollHeight=53，無裁切 |
| 完整方案 | PASS | dialog innerText 包含同一句五項說明 |
| 價格／規格 | PASS | NT$500、720p · Seedance 2.5 |
| build / git diff --check | PASS | exit0 |
| 本輪其他尺寸／鍵盤／動效／Console／完整功能回歸 | NOT_TESTED | 僅修改文案 |

URL http://127.0.0.1:5173/#pricing；截圖 `/private/tmp/portfolio-directory/aicg-included-mobile.png`。
建議 commit message: `docs: clarify included AICG services`。沒有 commit、push 或部署。等待驗收。

---

# 2026-11-04 — 桌面報價採用設計方案 1

final result: passed

預計／實際修改：`src/refinement.css`、`design-qa.md`。僅821px以上套用桌面配置，保留既有資料及功能。
標題／分類並排；左側選項、右側價格與服務內容；底部兩個按鈕並排，緊接摘要。1120px內容寬度、500px固定frame、中間細分隔線。

## 視覺證據
Source: `/Users/xiaoma/.codex/generated_images/01a1a44c-00e7-74b0-96ab-8fc7f5156f24/exec-be4d485a-f490-4a87-baaa-c16bff53ff5e.png` (1683×935)。
URL: http://127.0.0.1:5173/#pricing。
截圖：`/private/tmp/portfolio-directory/pricing-option1-desktop.png` (1440×900)、`pricing-option1-tablet.png` (768×1024)、`pricing-option1-mobile.png` (390×844)。
比較：`/private/tmp/portfolio-directory/pricing-option1-comparison.png`，來源與實作內容區分別裁切，再保持比例放入710×390區域並排；排除來源未含的網站導覽與不同viewport外部留白。
Typography：沿用真實網站字體與可讀尺寸，視覺層級一致。Spacing：雙欄、頂部分類、相鄰操作與分隔線符合所選方向。Colors：沿用品牌token。Assets：無新增圖片。Copy：無加回重複時長或方案標題。
可接受差異：保留既有「已選／選擇」文字狀態，未換成設計圖圓形指示；真實字體正文較設計圖緊湊。無待修P0/P1/P2。圖中小字可讀，並列內容區已涵蓋需檢視的細節。

| Self-check | 結果 | 證據 |
|---|---|---|
| 桌面各服務穩定 | PASS | 五服務frame均500px、scrollY900、actions bottom735；summary bottom581–614 < actions top679 |
| 窄桌面900px | PASS | 無水平溢出，summary bottom174 < actions top268（當時捲動位置） |
| 手機／平板維持單欄 | PASS | 390欄寬350、section844；768欄寬600、section1024；overflow=false |
| 完整方案／合作流程 | PASS | 兩按鈕皆開啟dialog；Escape及關閉按鈕皆可關閉，dialog=false |
| Console | PASS | error logs=[] |
| build / git diff --check | PASS | exit0 |
| 本輪reduced-motion、快速反向動畫、實體手機 | NOT_TESTED | 僅修改桌面靜態排版，未改動過渡邏輯 |

風險：821px以下仍為既有單欄；實體裝置未測。
建議 commit message: `style: apply compact desktop pricing layout`。
沒有 commit、push 或部署。等待使用者驗收。

---

# 2026-11-04 — 報價區文字去重

預計／實際修改：`src/components/ServiceSelector.vue`、`src/refinement.css`、`design-qa.md`。
刪除金額下方的時長與方案名稱；金額只顯示於摘要。封面規格不再重複於備註；單一方案名稱與服務相同時隱藏重複列，保持外框高度。included 摘要排除已顯示的完全相同方案名。價格資料、排除項目、車馬費及交期未修改。

| Self-check | 結果 | 證據 |
|---|---|---|
| 五種服務去重 | PASS | 短片／長片／封面／航拍／AICG 摘要h3均0，各只有一個price；封面/AICG重複列hidden |
| 必要條件 | PASS | 短片不含項目與航拍車馬費備註仍存在 |
| 方案切換 | PASS | 內容優化 selected，摘要NT$400 |
| 高度及溢出 | PASS | 手機五服務均844；平板1024／桌面900；三尺寸overflow=false |
| Console | PASS | error logs=[] |
| build / git diff --check | PASS | exit0 |
| 本輪鍵盤、reduced-motion、實體手機、完整閱讀器回歸 | NOT_TESTED | 未重跑 |

URL http://127.0.0.1:5173/#pricing；截圖 `/private/tmp/portfolio-directory/pricing-dedup-mobile.png`、`pricing-dedup-tablet.png`、`pricing-dedup-desktop.png`。已檢視手機截圖。限制：比較不同方案價格需要切換方案，金額不再重複列於選項。
建議 commit message: `refactor: remove repeated pricing copy`。沒有 commit、push 或部署。等待驗收。

---

# 2026-11-04 — 服務與長度選項視覺分層

預計與實際檔案：`src/components/ServiceSelector.vue`、`src/refinement.css`、`design-qa.md`。
短片／長片／封面改為白字＋螢光底線分頁；秒數選項改為較小圓角細框，選中以螢光框線與文字表達。依使用者最新要求移除影片長度及製作規格可見標籤，只保留無障礙群組名稱。未改報價、選擇邏輯與其他區塊。

| Self-check | 結果 | 證據 |
|---|---|---|
| 三尺寸排版 | PASS | 390×844、768×1024、1440×900 的 pricing 高度844/1024/900，overflow=false |
| 無新增可見標籤 | PASS | quote-duration-label count=0；已檢視手機與桌面截圖 |
| sibling 切換穩定 | PASS | 手機短片／長片／封面均h844/y844；原格線尺寸未變 |
| 快速反向動畫 | PASS | 手機20、平板25、桌面21種中間 transform；30 RAF samples |
| 鍵盤與價格 | PASS | 30秒 ArrowRight 後選60秒，過渡完成後 NT$500 |
| Reduced motion | PASS | 分頁底線與秒數按鈕 transitionDuration 均0s |
| Console | PASS | error logs=[] |
| build / git diff --check | PASS | exit0 |
| 實體手機、其他瀏覽器、完整報價閱讀器回歸 | NOT_TESTED | 本輪僅 IAB 響應式驗證 |

URL http://127.0.0.1:5173/#pricing。證據 `/private/tmp/portfolio-directory/pricing-hierarchy-mobile.png`、`pricing-hierarchy-tablet.png`、`pricing-hierarchy-desktop.png`。風險：本輪未測實體手機；無新增依賴與動畫框架。
建議 commit message: `style: distinguish service tabs from duration choices`。
沒有 commit、push 或部署，等待驗收。

---

# 2026-11-04 — 首頁服務小字移至上方

預計／實際修改：`src/components/HeroShowreel.vue`、`src/refinement.css`、`design-qa.md`。
服務小字獨立成 reel-topline，放導覽下方並與底部標題左側對齊；auto margin 吸收中間空間。標題與按鈕仍在底部，影片邏輯與其他區塊未變。文字改淡白色並加陰影，改善背景影片上的辨識。

| Self-check | 結果 | 證據 |
|---|---|---|
| 390×844 | PASS | 導覽底68、小字頂80.88，左右與標題同為20；底部內容bottom816 |
| 768×1024 | PASS | 導覽底68、小字頂94.48；底部內容bottom962.56 |
| 1440×900 | PASS | 導覽底76、小字頂100；底部內容bottom846 |
| 水平溢出 | PASS | 三尺寸 overflow=false |
| Console | PASS | error logs=[] |
| build / git diff --check | PASS | 命令 exit0 |
| 鍵盤／reduced-motion／播放功能回歸／實體手機 | NOT_TESTED | 本輪只調整靜態文字排版 |

證據 URL http://127.0.0.1:5173/#home；截圖 `/private/tmp/portfolio-directory/hero-topline-mobile.png`、`hero-topline-tablet.png`、`hero-topline-desktop.png`。已檢視手機與桌面實際截圖。風險：影片亮度隨畫面變化，本輪未逐幀量測對比度。
建議 commit message：`style: position hero services below navigation`。
沒有 commit、push 或部署。等待使用者驗收。

---

# 2026-11-04 — 首頁文字恢復底部對齊

預計／實際修改：`src/refinement.css`、`design-qa.md`。
原因：移除上方 selector 後，flex space-between 的唯一 flow child 置頂。改為 flex-end，沿用原有底部安全間距；不更動文案、影片及其他區塊。

| Self-check | 結果 | 證據 |
|---|---|---|
| 手機 390×844 | PASS | Hero bottom844，文字 bottom816，底部28px |
| 平板 768×1024 | PASS | Hero bottom1024，文字 bottom962.56，底部61.44px |
| 桌面 1440×900 | PASS | Hero bottom900，文字 bottom846，底部54px |
| 水平溢出 | PASS | 三尺寸 overflow=false |
| Console | PASS | error logs=[] |
| build / git diff --check | PASS | 兩命令 exit0 |
| 鍵盤／reduced-motion／完整功能回歸／實體手機 | NOT_TESTED | 本輪只改靜態 flex 對齊 |

URL http://127.0.0.1:5173/#home；截圖 `/private/tmp/portfolio-directory/hero-bottom-mobile.png`、`hero-bottom-tablet.png`、`hero-bottom-desktop.png`。已檢視手機及桌面截圖。無新增動效；極矮螢幕仍依原有最小內容高度自然捲動。
建議 commit message：`fix: keep hero copy bottom aligned`。
沒有 commit、push 或部署；等待驗收。

---

# 2026-11-04 — 裝置首頁影片與作品輪播目錄

final result: passed

本輪預計及實際修改：`src/components/HeroShowreel.vue`、`src/components/FeaturedWorks.vue`、`src/refinement.css`、`design-qa.md`。
首頁以 767px 以下選 AICG 冒險戰鬥，768px 以上選既有剪輯預覽；只掛載目前影片，移除首頁 01/02 選擇器，CTA 統一查看作品。作品輪播與目錄連動，移除 caption 分類與時長。既有商業資料、影片、部署未修改。
使用者本輪批准直接實作；保留既有 AICG/剪輯分類（優先於舊 skill 的短片/長片分類）。

## 視覺比較
- Source: `/Users/xiaoma/.codex/generated_images/01a1a44c-00e7-74b0-96ab-8fc7f5156f24/exec-69a105d5-0cb3-41c4-ac62-76d5f6062aa0.png`
- URL: http://127.0.0.1:5173/#works
- Evidence: `/private/tmp/portfolio-directory/mobile.png` (390×844)、`tablet.png` (768×1024)、`desktop.png` (1440×900)。
- Combined comparison: `/private/tmp/portfolio-directory/comparison.png`，來源縮放至 390×844 與瀏覽器 CSS 尺寸對齊，實作以 390×844 擷取。AICG 橫式首項。
- 首輪 P2：圖片與 caption 之間空白過大、桌面首張左側空白；改為圖片底部對齊、桌面首張從左緣開始，手機調整 heading 與目錄 tracks。第二輪 comparison 已重拍、檢視，無待修 P0/P1/P2。
- Typography PASS：沿用網站字體，作品／目錄階層清楚，標題無截斷。品牌導覽保留既有尺寸。
- Layout PASS：同屏包含作品與目錄，主圖與 caption 相鄰；小手機可自然捲動，不裁切。
- Colors PASS：既有海軍藍、螢光綠及冷藍分隔線。
- Assets PASS：實際影片縮圖取代生成圖，主體一致；播放為現有本機 SVG，箭頭沿用 Iconify。
- Copy PASS：沒有加回 AICG 影片生成與時長；目錄使用選擇作品切換預覽／正在預覽。
- Full-view comparison 中所有小文字可讀，無另裁 focused region 的必要。
- 可接受差異：保留既有 header/footer 與方向選取樣式、44px 控制項；縮圖為真實資產而非生成圖重繪。

## Self-check
| 驗證 | 結果 | 實際證據 |
|---|---|---|
| 首頁影片來源 | PASS | 390px 僅冒險戰鬥.mp4；768/1440px 僅 aerial/hero-preview.mp4，paused=false；picker count=0 |
| 手機 CTA | PASS | 查看作品導向 #works，選 AICG 直式冒險戰鬥 |
| 分類高度／捲動穩定 | PASS | 390 四組皆 h772/y1688；768 四組 h952/y2048；1440 四組 h828/y1800 |
| 快速反向中間幀 | PASS | 手機30幀29種 transform；平板30幀24種；桌面各組21–24種 transform |
| 輪播目錄連動 | PASS | 選歷史古裝後 caption、aria-current 同步；切回人物生活恢復 |
| 播放／關閉 | PASS | 歷史古裝 video readyState4、paused=false、time6.86；關閉後 dialog=false |
| 鍵盤 | PASS | 輪播 End 選取 02 歷史古裝 |
| Reduced motion | PASS | 模擬 reduce 後首頁已暫停，paused=true；progress transitionDuration=0s；復原測試設定 |
| 水平溢出 | PASS | 345/390/768/1440 scrollWidth 各等於 viewport |
| 小手機裁切 | PASS | 345×696 作品 h700，layout bottom608 < section bottom624；需要自然捲動 |
| Console | PASS | error/warn logs=[] |
| 實體手機、Safari/Firefox 本輪 | NOT_TESTED | 僅 IAB 響應式模擬，未宣稱真機 60fps |
| 報價完整流程回歸 | NOT_TESTED | 本輪未修改報價邏輯 |

風險：手機以 viewport breakpoint 判定；自動播放仍受瀏覽器省電政策影響。目錄超過兩項可內部捲動，固定 geometry。
建置與 git diff --check：PASS（本輪命令 exit 0）。
建議 commit message: `feat: adapt hero media and add linked works directory`。
沒有 commit、push 或部署。等待使用者驗收。

---

# Short viewport clipping fix — 2026-11-04

- PASS reproduction: at 345×696 the former 740px pricing section allowed its actions to extend 20px past the section, under the following works background.
- PASS fix: compact height breakpoint budgets all grid tracks, spacing and padding; ordinary mobile minimum is 800px, compact minimum 740px. No new animation or business-data changes.
- PASS geometry / horizontal overflow: 345×696 and 390×740 leave 16px clearance below actions; 390×844, 768×1024 and 1440×900 leave 24px. No horizontal overflow in any of the five viewports. Summary/action track gaps are 8/8/12/12/20px respectively.
- PASS interaction: 合作流程 opens the complete workflow reader; Escape sent to close it. Console error/warn array empty.
- PASS build and whitespace: npm run build; git diff --check.
- NOT_TESTED: iPhone hardware, text zoom, full keyboard and reduced-motion regression in this patch. Motion logic unchanged.
- Evidence: http://127.0.0.1:5173/#pricing, 345×696 viewport, `/private/tmp/portfolio-clipping-fix/boundary-345.png` shows both actions completely above Works.
- Tradeoff: 696px-high viewport uses a readable 740px pricing frame, requiring a small amount of natural scrolling; it does not force clipped one-screen content.
- Planned / actual changed files this turn: src/refinement.css, design-qa.md. Existing uncommitted work preserved. Three ImageGen carousel concepts are preview-only, not implemented.
- Suggested commit: fix: prevent pricing actions overflowing short viewports
- No commit, push or deployment.

---

# Design QA — 方案 1 與跨瀏覽器播放標記（2026-11-04）

final result: passed

## Target / evidence

- Source: `/Users/xiaoma/.codex/generated_images/01a1a44c-00e7-74b0-96ab-8fc7f5156f24/exec-45f1b43e-69c7-41c8-8bfa-09dac4ab705a.png` (852×1846), normalized to 390×844.
- Implementation: `http://127.0.0.1:5173/#pricing`, short / 30 seconds / basic, dark theme.
- Full-view comparison: `/private/tmp/portfolio-option1/comparison-final.png` (780×844; source left, browser right). Text-only screen; full view makes each region readable, no separate crop necessary.
- Browser screenshots: `/private/tmp/portfolio-option1/pricing-390.png`, `pricing-768.png`, `pricing-1440.png` (390×844, 768×1024, 1440×900 respectively, CSS px / image px 1:1).
- Works: `/private/tmp/portfolio-option1/works-390.png`; Safari desktop: `/private/tmp/portfolio-option1/safari-works.png` (native app image 2880×1800; not treated as a mobile viewport).

## Comparison history

1. FAIL / P1: inherited dark heading color on navy, double anchor/header offset clipped bottom action. Fixed foreground colors and root scroll-padding; each section owns header space.
2. FAIL / P2: mobile price rows/actions smaller than selected reference. Increased row labels and prices to 20px, summary title 22px, body 16px, actions 20px; tightened heading grid. Final combined evidence above.
3. FAIL / P2: Safari stage clipped bottom of play badge. Media now sizes against actual stage using container units, with viewport fallback. Native Safari image verifies complete badge.
4. PASS: final reference comparison has no remaining actionable P0/P1/P2. Preserved existing compact site wordmark; used textual selection state instead of decorative check glyph, retained source-data wording and 44px controls. These intentional accessibility/content differences are not pixel-exact reproduction claims.

## Fidelity surfaces

- PASS typography: system Chinese sans-serif, white title, lime large price; hierarchy and single-screen action visibility match reference. Exact generated font is unknown; existing site font retained.
- PASS spacing: mobile hierarchy and separators match selected design; desktop adapts to two columns. Same breakpoint retains a stable frame across services. Tall tablet has extra space in summary track, not state-dependent geometry.
- PASS colors: existing navy and lime tokens; play badge uses lime background, dark SVG and label.
- PASS assets: original work posters unchanged. Official Bootstrap `play-fill.svg` and MIT license bundled locally; no emoji/icon-font/API dependency for the new play mark.
- PASS copy: all prices, tiers, turnaround, cooperation and cover data sourced from existing `services.js`; no business data edited. Summaries shorten the display, full details remain readable in dialog.

## Self-check

| Check | Result | Evidence |
| --- | --- | --- |
| Build | PASS | npm run build, Vite production build completed |
| Diff whitespace | PASS | git diff --check, exit 0 |
| Three screens | PASS | 390×844: hero/pricing/works+footer 844 each; 768×1024: 1024 each; 1440×900: 900 each |
| Horizontal overflow | PASS | document.scrollWidth <= innerWidth at all three sizes |
| Service state geometry | PASS | mobile editing/aerial/AICG: pricing height 844, works document top 1688 |
| Summary motion / rapid reversal | PASS | mobile 122 RAF samples, 17 fractional-opacity frames, y and height stayed 844, one summary remained |
| Tablet / desktop summary motion | PASS | 13 / 14 fractional-opacity frames; y and height fixed at 1024 / 900 respectively |
| Reader exit / focus | PASS | 15 fractional-opacity frames; content retained until removal; y stayed 844; focus returned to 查看完整方案 |
| Keyboard | PASS | ArrowRight selected cover; Escape closed reader and restored focus |
| Reduced motion | PASS | emulated reduce: selected 60s, NT$500, one summary, dialog closed |
| Cover detail | PASS | native existing platform selector and prices rendered in reader, YouTube 16:9 selected |
| Video playback | PASS | viewer opened; video readyState=4, paused=false, currentTime=21.955767 |
| SVG rendering | PASS | Chromium loaded SVG data URI, naturalWidth=16; native desktop Safari screenshot shows triangle and label |
| Console | PASS | captured error/warn array empty |
| Safari playback interaction | NOT_TESTED | native automation timed out on click; visual result only verified |
| iPhone hardware / Firefox / 60fps | NOT_TESTED | no corresponding device/browser/performance measurement |
| Text zoom and short landscape | NOT_TESTED | minimum readable heights intentionally permit document overflow on unusually short viewports |

## Files / scope

Planned and actual: `src/components/ServiceSelector.vue`, new `src/components/PricingReader.vue`, `src/components/FeaturedWorks.vue`, `src/refinement.css`, new `src/assets/icons/bootstrap/play-fill.svg` and `LICENSE`, this report. Existing AGENTS.md and untracked earlier docs preserved. Prior scroll-snap removal retained. No dependencies added. No commit, push, or deployment.

Suggested commit: `feat: add stable pricing screens and accessible branded play badge`

---

## Previous QA history (preserved)

# Design QA — 視覺回退

**Source visual truth**

- Primary target: `/private/tmp/editorial-baseline-desktop.jpg`
- Supporting pre-editorial structure reference: `/private/tmp/studio-structure-before-services.png`

**Rendered implementation evidence**

- Hero (Desktop): `/private/tmp/restored-editorial-hero-ready-1440.png`
- Service cards and expanded short-film detail (Desktop): `/private/tmp/restored-editorial-services-1440.png`, `/private/tmp/restored-editorial-short-detail-1440.png`
- Aerial detail (Desktop): `/private/tmp/restored-editorial-aerial-detail-1440.png`
- Restored advisor result (Desktop): `/private/tmp/restored-editorial-advisor-result-1440.png`
- Tablet: `/private/tmp/restored-editorial-services-768.png`
- Mobile: `/private/tmp/restored-editorial-services-390.png`, `/private/tmp/restored-editorial-short-detail-390.png`

**Viewport and state**

- Desktop source and implementation: 1440 × 1000 pixels, CSS viewport 1440 × 1000, device scale factor 1. No density normalization was necessary.
- Tablet implementation: CSS viewport 768 × 1000, screenshot 768 × 1000.
- Mobile implementation: CSS viewport 390 × 844, screenshot 390 × 844.
- Desktop comparison state: initial Hero after its entry transition completed; source and implementation were reviewed together in the same visual comparison input.
- Focused comparison state: selected short-film service card and the expanded detail container, compared against the supporting pre-editorial structure capture. This supporting capture has a different vertical crop (1440 × 1100), so only its shared service-card/detail regions were judged.

**Comparison history**

1. **P1 — editorial redesign drift (pre-fix).**
   - Evidence: the running page used altered Hero copy/hierarchy, flat service presentation, segmented full-width detail content, and a changed advisor/contact treatment instead of the specified pre-editorial visual direction.
   - Fixes made: restored the Hero copy/hierarchy and floating-player label; reinstated the three large service cards; restored the rounded detail container with a left information column and right workflow column; restored the advisor and contact section framing.
2. **Post-fix comparison.**
   - Evidence: the Desktop Hero comparison uses the primary target and `/private/tmp/restored-editorial-hero-ready-1440.png`; the service/detail comparison uses the supporting structure reference and the Desktop detail captures above.
   - Result: no remaining actionable P0, P1, or P2 visual mismatch was found within the requested rollback scope.

**Findings**

- No actionable P0/P1/P2 findings remain.
- [P3] The service-detail content necessarily carries the later verified price, phase, and “修改至滿意” workflow data, so its typography and internal sequence are newer than the historical supporting screenshot. This is intentional and required by the rollback brief; the original container hierarchy, card treatment, border, and split-column visual structure are restored.

**Required fidelity surfaces**

- **Fonts and typography:** The Hero eyebrow, two-line white H1, supporting copy, player label, centered services heading, and card hierarchy match the pre-editorial hierarchy. No truncation or clipping was observed at 1440, 768, or 390px.
- **Spacing and layout rhythm:** The Hero preserves the broad left-copy/right-player composition. The service selector is again a three-card grid on desktop/tablet and a one-column stack on mobile. The service detail is again one rounded bordered container with a local left/right split rather than the removed full-width editorial sections.
- **Colors and visual tokens:** Sky blue/cloud Hero, mist-white page, pale blue borders, restrained shadows, and small fluorescent-yellow selection/CTA accents are present and consistent with the source direction.
- **Image quality and asset fidelity:** The existing `hero-sky` image asset and actual HTML video player were retained. No generated image, fake artwork, CSS drawing, or handcrafted SVG replacement was introduced.
- **Copy and content:** Baseline Hero and section copy were restored where requested. Current verified prices, delivery labels, formula, recommendation result, and workflow language remain intentionally current.
- **Interactions and accessibility:** Cards remain semantic buttons with `aria-expanded`; the tier picker remains a radiogroup. A real browser check confirmed one selected card/detail at a time, the short-film NT$500 tier update, long-film NT$1,500 without long-term plans, aerial 5/10/15-minute pricing examples, and the local recommendation result.
- **Viewport resilience:** `documentElement.scrollWidth === clientWidth` at 1440, 768, and 390px. No horizontal overflow was observed.
- **Workflow stability:** During a full short-film playback, `longTermTop` remained `340.1640625px` and `contactTop` remained `509.1640625px` across steps 01–06 and the final conclusion; the workflow still reveals sequentially.

**Open questions**

- Reduced-motion emulation was not available in this browser session. The existing implementation remains in place and was not changed by this rollback.

**Implementation checklist**

1. Restore the pre-editorial visual hierarchy without reverting verified service data or workflow logic. — complete
2. Validate the three responsive widths and active service states. — complete
3. Build the production bundle and inspect the browser console. — complete

**Follow-up polish**

- None required for this rollback. If a later visual-art-direction pass is requested, use a new approved reference rather than changing this restored baseline.

final result: passed
