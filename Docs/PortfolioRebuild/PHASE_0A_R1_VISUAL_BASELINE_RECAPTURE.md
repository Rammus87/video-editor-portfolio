# Portfolio Rebuild｜Phase 0A-R1 視覺基準重拍與版面量測

本輪是 Phase 0A 的證據補強，不是 UI 修正。

目前 Desktop／Tablet 的 full-page 截圖出現異常：

- Desktop 內容只占左側狹窄區域，右側有大面積空白。
- Tablet 的 Hero 文字與播放器在右側遭到裁切。
- `scrollWidth === clientWidth` 只能證明頁面沒有可捲動的水平溢出，不能排除內容被 `overflow: hidden` 裁切。

本輪唯一目標是使用一般 viewport 截圖與 DOM 實際尺寸，判斷問題來自 full-page 截圖器，還是網站真實 breakpoint／容器寬度。

不得修改或修正 UI。

## Context

### 必讀

操作前依序完整閱讀：

```text
/Users/xiaoma/Desktop/接案網站/AGENTS.md
/Users/xiaoma/Desktop/接案網站/.agents/skills/video-editor-portfolio-rebuild/SKILL.md
/Users/xiaoma/Desktop/接案網站/Docs/PortfolioRebuild/PHASE_0A_READONLY_AUDIT.md
```

### 專案位置

```text
/Users/xiaoma/Desktop/接案網站
```

### 既有 Phase 0A 證據

```text
/private/tmp/portfolio-phase0a.aVbUh2/desktop-1440-full.png
/private/tmp/portfolio-phase0a.aVbUh2/tablet-768-full.png
/private/tmp/portfolio-phase0a.aVbUh2/mobile-390-full.png
/private/tmp/portfolio-phase0a.aVbUh2/build-out
```

若上述暫存檔已不存在，記錄 `NOT_FOUND`；不得因此修改專案。

Phase 0A 使用的預覽網址：

```text
http://127.0.0.1:4174/
```

先確認該服務是否仍可達。

## Constraints

- 不得修改、建立、刪除、移動或重新格式化任何專案檔案。
- 不得修改 CSS、Vue、資料、設定、Skill、AGENTS 或工程文件。
- 不得修正 Desktop／Tablet 版面。
- 不得執行 `apply_patch`。
- 不得安裝依賴。
- 不得執行新的 Production build。
- 不得執行 `git init`。
- 不得 commit、push 或部署。
- 不得進入 Phase 0B 或 Phase 1。
- 不得使用 full-page screenshot 作為本輪主要證據。
- 截圖不得使用自動縮放、Fit to page 或非 100% browser zoom。
- 所有新證據只能寫入 `mktemp -d` 建立的專案外暫存目錄。
- 只能停止本輪自行啟動的預覽程序。

### 預覽恢復邊界

依序處理：

1. 若 `http://127.0.0.1:4174/` 可達，直接使用。
2. 若服務不可達，但 Phase 0A 的外部 `build-out` 仍存在，可使用既有本地 Vite／Node 以 preview 模式啟動該外部 build output。
3. 不得重新 build。
4. 不得啟動 dev server。
5. 不得寫入專案內 `dist` 或 cache。
6. 若無法安全恢復 preview，本輪 runtime 項目標示 `NOT_TESTED` 並停止。

## Goal

### 1. 建立前後 manifest

在任何 browser 操作前，建立專案外檢查前 manifest。

沿用 Phase 0A 規則：

- 涵蓋根目錄第一方檔案、`src`、`public`、`Docs`、`.agents`、`AGENTS.md`、既有 `dist`。
- 排除 `node_modules`、`.git`、`.DS_Store`。
- 記錄相對路徑、大小與 SHA-256。

全部檢查完成後建立相同格式的檢查後 manifest 並比較。

### 2. 固定瀏覽器條件

三個尺寸都必須確認：

- Browser zoom：100%。
- Device scale factor：1。
- 不啟用手機裝置 preset。
- 只設定 viewport 寬高。
- 等待頁面 load、圖片與字體穩定。
- 不使用 full-page screenshot。
- 不使用會改變 CSS layout width 的截圖縮放。

Viewport：

```text
Desktop：1440 × 1000
Tablet：768 × 1000
Mobile：390 × 844
```

每次設定 viewport 後重新整理頁面並回到 `scrollY = 0`。

### 3. 記錄瀏覽器與根容器尺寸

每個 viewport 都要實際記錄：

```text
window.innerWidth
window.outerWidth
window.devicePixelRatio
window.visualViewport.width
document.documentElement.clientWidth
document.documentElement.scrollWidth
document.body.clientWidth
document.body.scrollWidth
window.scrollX
window.scrollY
```

記錄以下元素的 `getBoundingClientRect()`：

```text
html
body
#app
main（若存在）
第一個 Hero section
服務選擇 section
方案建議 section
footer／最後一個主要 section
```

每個元素至少回報：

- `x`
- `left`
- `right`
- `width`
- computed `width`
- computed `max-width`
- computed `overflow-x`

若 selector 與實際 DOM 不符，先從既有 Vue 元件與 DOM 找到正確元素，只讀記錄；不得新增 selector 或測試 attribute。

### 4. 找出可見但越界的元素

每個 viewport 執行只讀 DOM 檢查，列出可見元素中符合任一條件者：

```text
rect.left < 0
rect.right > document.documentElement.clientWidth
rect.width > document.documentElement.clientWidth
```

至少記錄：

- element tag
- class／id
- rect left／right／width
- computed position
- computed overflow
- 所屬主要區塊

忽略：

- `display: none`
- `visibility: hidden`
- 寬高為 0

不得因為 `scrollWidth === clientWidth` 就忽略越界元素。

### 5. 擷取一般 viewport 截圖

每個尺寸擷取以下四個位置，每張都必須是當前 viewport 大小，不得 full-page：

#### A. Hero

```text
scrollY = 0
```

#### B. 服務選擇

將「這次想剪哪一種影片？」區塊頂部對齊或接近 viewport 頂部。

#### C. 方案建議

將「不確定該怎麼選？」區塊頂部對齊或接近 viewport 頂部。

#### D. 頁面底部

捲到頁面最底部，擷取最後一個 viewport。

共應產生 12 張截圖：

```text
desktop-1440-hero.png
desktop-1440-services.png
desktop-1440-advisor.png
desktop-1440-bottom.png

tablet-768-hero.png
tablet-768-services.png
tablet-768-advisor.png
tablet-768-bottom.png

mobile-390-hero.png
mobile-390-services.png
mobile-390-advisor.png
mobile-390-bottom.png
```

### 6. 驗證截圖檔案尺寸

使用現有本機工具檢查圖片像素尺寸。

必須符合：

| 檔案前綴 | 實際像素尺寸 |
|---|---|
| `desktop-1440-*` | 1440 × 1000 |
| `tablet-768-*` | 768 × 1000 |
| `mobile-390-*` | 390 × 844 |

如果截圖工具輸出的尺寸不符：

- 標示 `FAIL`
- 記錄實際尺寸
- 不得把該圖片當成有效基準

### 7. 判斷問題來源

依實際證據只能選擇一種結論：

#### A. `CAPTURE_TOOL_ONLY`

條件：

- 一般 viewport 截圖尺寸正確。
- `html`、`body`、`#app` 與主要 sections 寬度合理覆蓋 viewport。
- Desktop 不再只顯示約手機寬度的內容。
- Tablet 的主要文字與播放器沒有不合理裁切。
- 越界元素符合既有有意設計，且必要內容沒有消失。

#### B. `REAL_LAYOUT_BUG`

符合任一條件：

- Desktop 的 `#app` 或主要內容實際只占約手機寬度。
- Desktop 右側仍存在不合理大面積空白。
- Tablet 的必要文字或播放器實際超出 viewport 並被裁切。
- 可見必要元素因 `overflow-x: hidden` 消失。
- 一般 viewport 截圖仍重現原異常。

#### C. `INCONCLUSIVE`

條件：

- Preview 無法安全使用。
- 截圖尺寸無法固定。
- DOM 數值與圖片互相矛盾。
- 證據不足以區分截圖器與實際布局。

不得用推測選擇 `CAPTURE_TOOL_ONLY`。

### 8. 不修正

即使判定為 `REAL_LAYOUT_BUG`：

- 只定位可能 owner。
- 列出相關 CSS／Vue 檔案與 selector。
- 不得修改。
- 不得提供順手修正。
- 停止並把證據交回 ChatGPT。

## Self-Check

每項使用 `PASS`、`FAIL` 或 `NOT_TESTED`，附實際證據。

| 檢查項目 | 驗證要求 |
|---|---|
| AGENTS／Skill 已讀 | 實際路徑 |
| 專案零修改 | 前後 manifest 相同 |
| Preview | URL 與回應狀態 |
| Browser zoom | 100% 證據 |
| Device scale factor | 1 |
| Desktop Hero | 1440×1000 截圖 |
| Desktop Services | 1440×1000 截圖 |
| Desktop Advisor | 1440×1000 截圖 |
| Desktop Bottom | 1440×1000 截圖 |
| Tablet 四張 | 每張 768×1000 |
| Mobile 四張 | 每張 390×844 |
| 根容器寬度 | 三尺寸 DOM rect |
| 水平捲動 | scrollWidth／clientWidth |
| 越界元素 | 三尺寸實際列表 |
| Desktop 大面積空白 | 是否在一般截圖重現 |
| Tablet 右側裁切 | 是否在一般截圖重現 |
| 問題分類 | CAPTURE_TOOL_ONLY／REAL_LAYOUT_BUG／INCONCLUSIVE |
| Console | error／warning |
| Git | NOT_TESTED；目前不是 repository |
| Build | NOT_TESTED；本輪禁止重建 |

## 預計修改檔案

```text
無
```

## 實際修改檔案

最終分開列出：

1. 專案內檔案：預期為「無」。
2. 專案外暫存證據：列出實際路徑。

若任何專案檔案改變：

- 零修改標示 `FAIL`
- 列出精確路徑
- 立即停止
- 不得自行還原

## 驗收條件

- 專案前後 manifest 完全一致。
- 12 張一般 viewport 截圖尺寸正確。
- 三種 viewport 都有根容器實際寬度。
- 三種 viewport 都有可見越界元素檢查。
- 明確分類為 `CAPTURE_TOOL_ONLY`、`REAL_LAYOUT_BUG` 或 `INCONCLUSIVE`。
- 沒有修改 UI、CSS、Vue、資料或設定。
- 沒有 build、Git 初始化、commit、push 或部署。

## 最終回報順序

1. Phase 0A-R1 結論。
2. 問題分類。
3. PASS／FAIL／NOT_TESTED 表格。
4. 預覽與瀏覽器條件。
5. 三尺寸根容器量測表。
6. 三尺寸越界元素表。
7. 12 張截圖路徑與像素尺寸。
8. Desktop 大面積空白判斷。
9. Tablet 右側裁切判斷。
10. 若為真實布局問題，列出可能 owner，但不得修正。
11. 前後 manifest 比較。
12. 預計修改檔案。
13. 實際修改檔案。
14. 建議下一步，但不得執行。

建議 commit message：

```text
不適用；本輪沒有修改
```

完成後停止，等待使用者把完整報告與有效截圖交回 ChatGPT。
