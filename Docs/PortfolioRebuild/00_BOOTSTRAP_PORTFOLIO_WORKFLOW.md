# Portfolio Rebuild｜Codex Workflow Bootstrap

你現在要為現有的 Vue 3／Vite 個人影片剪輯網站建立「專案級 Codex Workflow」。

這是一次性的 Bootstrap 任務。它是唯一可以在專案 Skill 尚未存在前執行的任務。

完成後，後續每一個 Phase 都必須先讀取本輪建立的專案 Skill，再讀取該 Phase 的獨立任務 `.md`。

本輪不要執行 Phase 0A，不要盤點網站，不要設計畫面，也不要修改任何網站功能。

## Context

### 專案位置

```text
/Users/xiaoma/Desktop/接案網站
```

### 專案內 Docs 參考資料

```text
/Users/xiaoma/Desktop/接案網站/Docs/PortfolioRebuild/video-editor-portfolio-rebuild-plan.md
/Users/xiaoma/Desktop/接案網站/Docs/PortfolioRebuild/reference-portfolio-site.mov
```

先確認：

1. 專案目錄可讀。
2. 工程計畫檔案可讀。
3. 參考影片可讀。
4. 是否已存在下列檔案或同名 Skill：

```text
/Users/xiaoma/Desktop/接案網站/AGENTS.md
/Users/xiaoma/Desktop/接案網站/.agents/skills/video-editor-portfolio-rebuild/SKILL.md
```

若 `AGENTS.md` 已存在，不得覆寫，先閱讀並判斷能否安全追加本專案規則。若有衝突或無法安全合併，停止並回報。

若同名 Skill 已存在，不得覆寫，停止並回報其實際內容與差異。

## Constraints

- 本輪只允許新增或安全更新：

```text
AGENTS.md
.agents/skills/video-editor-portfolio-rebuild/SKILL.md
```

- 不得修改 `src`、`public`、`package.json`、lockfile、Vite 設定、環境變數或其他網站檔案。
- 不得複製、移動、重新編碼或匯入參考影片。
- 參考影片目前位於 `Docs/PortfolioRebuild`，只作為工程參考，不是網站 runtime asset。
- 不得把參考影片複製至 `src`、`public` 或其他網站資產路徑。
- 不得修改 `.gitignore`，也不得主動 track、untrack、stage 或 commit 參考影片；只回報目前 Git 狀態。
- 不得新增其他說明文件、README、範例、script、asset 或不必要的 Skill 資源。
- 不得安裝套件。
- 不得執行 Production build。
- 不得啟動或停止網站預覽。
- 不得部署。
- 不得 commit 或 push。
- 不得開始 Phase 0A。
- 若工作區原本已有修改，必須保留，不得清理、還原或混入本輪範圍。

## Goal

### 1. 建立根目錄 `AGENTS.md`

如果根目錄不存在 `AGENTS.md`，建立以下內容。

如果已存在，僅在確認沒有衝突時，把等效規則安全整合進既有檔案，不得刪除原規則。

```md
# Portfolio Rebuild Project Instructions

在此專案執行任何分析、修改、測試或審查前：

1. 完整閱讀 `.agents/skills/video-editor-portfolio-rebuild/SKILL.md`。
2. 若使用者指定 Phase 任務檔，完整閱讀該 `.md` 後才可操作。
3. 只執行目前指定的單一 Phase，不得提前進入後續階段。
4. 修改前列出預計修改檔案；完成後列出實際修改檔案。
5. 未經使用者明確要求，不得 commit、push 或部署。
6. 所有驗證只能回報 PASS、FAIL 或 NOT_TESTED，並附實際證據；不得用推測取代測試。
7. 若 Phase 任務與專案 Skill 衝突，以該 Phase 中使用者明確提出的較新要求為準，並在回報中指出差異。
```

### 2. 建立專案級 Skill

建立：

```text
.agents/skills/video-editor-portfolio-rebuild/SKILL.md
```

內容如下：

```md
---
name: video-editor-portfolio-rebuild
description: Manage every audit, design, implementation, QA, and release phase for the personal Vue 3/Vite video-editor portfolio rebuild. Use for any work inside this project involving the homepage, Showreel, portfolio works, profile, services, pricing, recommendation tool, contact logic, responsive design, motion, accessibility, or deployment.
---

# 個人影片剪輯作品網站重構

## 執行入口

每次處理本專案任務時：

1. 先完整閱讀使用者指定的 Phase 任務 `.md`。
2. 需要整體產品背景時，閱讀：

```text
/Users/xiaoma/Desktop/接案網站/Docs/PortfolioRebuild/video-editor-portfolio-rebuild-plan.md
```

3. 只有 Phase 任務明確要求視覺或動效參考時，才唯讀檢視：

```text
/Users/xiaoma/Desktop/接案網站/Docs/PortfolioRebuild/reference-portfolio-site.mov
```

4. 參考影片只能保留在 `Docs/PortfolioRebuild` 作為工程參考，不得複製至 `src`、`public` 或其他網站資產路徑。
5. 不得主動 stage、commit、移動、重新編碼或修改參考影片。
6. 一次只完成一個 Phase。當前 Phase 未通過驗收前，不得進入下一階段。

## 產品定位

本網站是個人影片剪輯工作室，不是多人接案平台，也不是一般企業形象網站。

核心轉換路徑：

```text
作品與審美吸引
→ 播放 Showreel／代表作品
→ 瀏覽作品分類
→ 理解個人能力與經歷
→ 查看服務、價格與合作流程
→ 主動聯絡委託
```

首頁必須先展示作品與個人風格，服務與價目表置於作品敘事之後。

作品分類固定為：

- 短片
- 長片
- 航拍素材

不得捏造作品、客戶、合作經驗、成效、數字、評價或公開授權。

## 視覺方向

借鑑而不複製以下設計原則：

- 作品主導的內容順序。
- 大型代表作品與可探索的作品目錄。
- 深海軍藍、冷藍細線與少量螢光綠狀態色。
- 編輯式排版、大型編號、欄位與細分隔線。
- 作品分類與目前分類高亮。
- 作品 Lightbox。
- 個人經歷 Accordion。
- 有節制的 hover、區塊與頁面轉場。

現有天空 Hero 可作為個人識別的一部分；不得因參考網站是深色，就把所有頁面直接塗成純黑。

避免：

- 每個區塊都變成圓角卡片。
- 大量玻璃卡、漸層球與無意義光斑。
- 過度置中或制式化等寬卡片牆。
- 大量英文裝飾字。
- AI 套版式文案。
- 大幅彈跳、反覆閃爍或所有元素同時進場。
- 作品顯示後因捲動反覆消失或播放進場動畫。

不得直接複製：

- 參考網站的作品、圖片、影片及人物資料。
- 品牌、Logo、文字及客戶資料。
- 原始程式碼。
- 逐像素頁面配置。
- 高度識別性的圖形與游標造型。
- 完全相同的動畫時間、順序及細節組合。

## 動效與響應式

- 動畫必須服務作品探索。
- 優先使用 Vue、CSS Transition、CSS Grid 與少量 composable。
- 未經同意不得安裝大型動畫框架。
- 游標光暈與卡片傾斜只在 `(hover: hover) and (pointer: fine)` 啟用。
- 手機沒有 hover；作品名稱、類別及必要資訊必須預設可見。
- 支援 `prefers-reduced-motion`，降級後內容直接穩定顯示。
- 動畫優先使用 `transform` 與 `opacity`。
- 不得用會反覆改變文件高度的進場動畫。
- 觸控目標至少 44×44px。
- 保留清楚的鍵盤 focus 樣式。
- 視覺 Phase 必須檢查 1440、768、390px。
- 每個 viewport 都要檢查水平捲動。

## 正式商業資料

### 短片

- 30 秒內簡單剪輯：NT$300。
- 不含文案與內容優化。
- 30 秒內，含文案、內容優化與節奏調整：NT$400。
- 60 秒內，含文案、內容優化與節奏調整：NT$500。
- 上述方案初稿原則上於 24 小時內。
- 3 分鐘內：2 個工作天。
- 長期合作每週 20 支內：NT$3,000。
- 長期合作每週 40 支內：NT$5,000。

### 長片

- 8 分鐘內：NT$1,500。
- 12 分鐘內：NT$2,000。
- 包含文案、內容優化、節奏調整與封面標題。
- 12 分鐘以上：另行洽詢。
- 8 分鐘內：5 個工作天，包含 4 天製作與 1 天調整。
- 8 分鐘以上：7 個工作天，包含 6 天製作與 1 天調整。
- 長片沒有長期合作方案。

### 航拍素材

- 車馬費另計。
- 基礎剪輯後成片每 5 分鐘 NT$1,000。
- 10 分鐘 NT$2,000。
- 15 分鐘 NT$3,000。
- 總價為車馬費＋基礎剪輯費。

### 合作規則

- 區塊名稱使用「合作流程」。
- 初稿前包含需求確認、素材提供與方向討論。
- 合作前確認範圍內修改至滿意。
- 中途更換主題、增加大量素材或改變成片規格時，才重新確認排程與費用。
- 方案推薦工具不送出、不儲存資料。
- 聯絡方式只顯示已設定的環境變數，不得使用假資料。
- 檢查環境變數時只回報名稱與使用位置，不得輸出私人聯絡內容或 secret。

視覺重構不得擅自修改以上資料。若現況與正式資料不符，先回報差異；除非當前 Phase 明確授權，否則不得修正。

## 工程邊界

- 先讀實際專案，不得推測元件、資料或路由結構。
- 優先保留現有可重用的資料與功能 owner。
- 作品資料不得直接散落寫死在多個元件。
- 影片列表以 poster 優先；不得在初始頁同時自動載入或播放全部影片。
- 不得為了填滿版面加入假作品或 AI placeholder。
- 若工作區原本已有修改，視為使用者內容，必須保留。
- 不得使用破壞性 Git 指令。
- 未經使用者同意不得新增依賴。
- 未經使用者明確要求不得 commit、push 或部署。
- 發現目前 Phase 需要新增權限、外部協調或擴大範圍時，停止並回報。

## Phase 執行方式

每個 Phase 開始前：

1. 重述本輪唯一目標。
2. 列出預計修改檔案。
3. 列出不可修改範圍。
4. 檢查 Git 與既有工作樹狀態。
5. 只處理當前 Phase。

每個 Phase 完成後：

1. 列出實際修改檔案。
2. 說明每個檔案的變更。
3. 列出已知風險。
4. 逐項執行該 Phase 的 Self-Check。
5. 提供 PASS、FAIL 或 NOT_TESTED 與實際證據。
6. 執行 `git diff --check`；若不是 Git repository，標示 NOT_TESTED。
7. 提供建議 commit message，但不得自行 commit。
8. 停止並等待使用者驗收。

## 驗證誠信

- PASS 必須有實際命令、畫面、數值或操作證據。
- 沒有執行的項目只能標示 NOT_TESTED。
- 已執行但未符合要求的項目標示 FAIL。
- 不得把靜態程式碼閱讀推論成 runtime PASS。
- 不得把 build 成功推論成功能或視覺正確。
- 不得把單一 viewport 推論為其他尺寸也正確。
- 建置失敗只記錄實際錯誤；除非 Phase 授權，不得順手修正。
- 截圖必須標示 URL、viewport 與實際檔案路徑。
- Console、鍵盤、reduced-motion、水平捲動及既有功能回歸必須分開回報。

## 固定回報欄位

每次回報至少包含：

1. 本輪結果。
2. 預計修改檔案。
3. 實際修改檔案。
4. 實作內容或盤點結果。
5. 風險。
6. Self-Check 表格。
7. `git diff --check`。
8. 建議 commit message。
9. 明確說明沒有 commit、push 或部署。
10. 停止並等待下一個 Phase。
```

### 3. 驗證載入結構

完成檔案建立後：

1. 重新讀取 `AGENTS.md` 全文。
2. 重新讀取 `.agents/skills/video-editor-portfolio-rebuild/SKILL.md` 全文。
3. 確認 Skill YAML frontmatter 只有：
   - `name`
   - `description`
4. 確認 skill folder 使用小寫英文字母與連字號。
5. 確認沒有建立其他不必要檔案。
6. 若是 Git repository，執行：

```text
git diff --check
git status --short
```

7. 不執行 build、lint、test 或瀏覽器測試，因為本輪沒有修改網站。

## Self-Check

使用 PASS、FAIL 或 NOT_TESTED，附實際證據：

| 檢查項目 | 驗證要求 |
|---|---|
| 專案路徑 | 實際絕對路徑 |
| 工程計畫可讀 | 檔案路徑 |
| 參考影片可讀 | 檔案路徑；不得複製 |
| `AGENTS.md` | 存在並重新讀取 |
| `SKILL.md` | 存在並重新讀取 |
| YAML frontmatter | 只有 name／description |
| Skill 路徑 | `.agents/skills/video-editor-portfolio-rebuild/SKILL.md` |
| 非授權檔案 | 確認沒有新增或修改 |
| `git diff --check` | 實際輸出；非 Git 為 NOT_TESTED |
| Build | NOT_TESTED，本輪不需要 |
| Runtime／畫面 | NOT_TESTED，本輪不需要 |

## 預計修改檔案

```text
AGENTS.md
.agents/skills/video-editor-portfolio-rebuild/SKILL.md
```

若 `AGENTS.md` 原本存在，必須在最終回報說明是「安全追加」或因衝突停止。

## 驗收條件

- 只新增或安全更新兩個授權檔案。
- `AGENTS.md` 會要求每次操作前讀取專案 Skill。
- Skill 包含產品定位、視覺邊界、正式商業資料、工程邊界、Phase Workflow 與驗證規則。
- 原始工程計畫與參考影片仍保留在 `Docs/PortfolioRebuild`。
- 沒有修改網站程式、UI、資料、資產或依賴。
- 沒有開始 Phase 0A。
- 沒有 commit、push 或部署。

## 最終回報格式

1. Bootstrap 結果。
2. 修改前檔案狀態。
3. 實際修改檔案。
4. `AGENTS.md` 載入規則摘要。
5. Skill 規則摘要。
6. Self-Check 表格。
7. `git diff --check`。
8. 建議 commit message。
9. 明確說明未執行 Phase 0A、build、commit、push、部署。

建議 commit message：

```text
docs: add portfolio rebuild workflow guidance
```

不得自行 commit。

完成後停止，等待使用者把完整回報交回 ChatGPT 審查。
