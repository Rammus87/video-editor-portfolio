# Portfolio Rebuild｜Phase 0A 唯讀現況盤點

本輪只執行 Phase 0A：建立網站重構前的可信現況報告。

不要修改網站、不要修正問題、不要建立 Git repository，也不要進入 Phase 0B 或 Phase 1。

## Context

### 必讀指令

在任何檢查前，依序完整閱讀：

```text
/Users/xiaoma/Desktop/接案網站/AGENTS.md
/Users/xiaoma/Desktop/接案網站/.agents/skills/video-editor-portfolio-rebuild/SKILL.md
/Users/xiaoma/Desktop/接案網站/Docs/PortfolioRebuild/video-editor-portfolio-rebuild-plan.md
```

讀完後先用 5–10 點摘要列出本輪實際受到哪些規則約束，再開始盤點。

### 專案位置

```text
/Users/xiaoma/Desktop/接案網站
```

### 參考影片

```text
/Users/xiaoma/Desktop/接案網站/Docs/PortfolioRebuild/reference-portfolio-site.mov
```

本輪只確認影片可讀、格式、大小、解析度與時長；不要分析或實作影片中的新畫面與動效。

### 本機預覽候選網址

```text
http://127.0.0.1:4173/
```

先檢查既有服務是否可達，不得直接假設預覽正在執行。

### Bootstrap 已知狀態

上一輪回報：

- `AGENTS.md` 已建立。
- `.agents/skills/video-editor-portfolio-rebuild/SKILL.md` 已建立。
- Bootstrap 只新增上述兩個檔案。
- 專案目前不是 Git repository。
- 未執行 build、runtime、commit、push 或部署。

本輪仍須用實際命令重新確認，不得只引用上一輪結論。

### 已知候選檔案

以下路徑曾出現在先前專案資訊中，但必須重新驗證，不得假設仍存在：

```text
src/data/services.js
src/utils/recommendation.js
src/assets/hero-sky.png
design-qa.md
```

## Constraints

### 唯讀邊界

- 本輪不允許修改、建立、刪除、移動或重新格式化任何專案檔案。
- 不得修改 `AGENTS.md`、Skill、工程計畫或參考影片。
- 不得執行 `apply_patch`。
- 不得建立 Vue 元件、作品資料、路由、樣式或測試檔案。
- 不得修正盤點過程發現的問題。
- 不得新增假作品、假客戶、假數據或 placeholder。
- 不得執行任何套件安裝或更新。
- 不得修改 lockfile、`package.json`、環境變數或設定檔。
- 不得執行 `git init`、`git add`、`git commit`、`git push` 或 `git stash`。
- 不得執行 `git clean`、`git reset`、`git restore` 或 `git checkout`。
- 不得修改 `.gitignore`。
- 不得 stage、track、untrack、移動、重新編碼或複製參考影片。
- 不得部署。
- 不得進入 Phase 0B 或 Phase 1。

所有截圖、檔案清單、校驗資料與 build output 只能寫入專案外、由 `mktemp -d` 建立的暫存目錄。

### 非 Git 專案的唯讀證據

因上一輪回報目前不是 Git repository，在其他操作前必須：

1. 建立專案外暫存目錄。
2. 對專案第一方檔案建立「檢查前 manifest」。
3. manifest 至少涵蓋：
   - 根目錄設定與文件
   - `src`
   - `public`
   - `Docs`
   - `.agents`
   - `AGENTS.md`
   - 既有 `dist`（若存在）
4. 可排除：
   - `node_modules`
   - `.git`
   - macOS 系統產生的 `.DS_Store`
5. 優先記錄相對路徑、檔案大小及 SHA-256；若某工具不可用，記錄實際降級方式。
6. 全部檢查完成後建立相同格式的「檢查後 manifest」並比較。

不得將 manifest 寫進專案。

如果無法可靠建立或比較 manifest，專案零修改檢查必須標示 `NOT_TESTED`，不得推測 PASS。

### 預覽限制

先唯讀檢查：

```text
http://127.0.0.1:4173/
```

- 若既有預覽可達，可進行截圖與互動檢查。
- 若不可達，不得直接啟動 dev server。
- 若專案已有可安全使用的 `dist` 與 preview 指令，而且啟動不會寫入專案，才可考慮使用。
- 只能停止本輪自行啟動的程序；不得停止使用者原本的程序。
- 無法確保唯讀時，畫面與 runtime 項目標示 `NOT_TESTED`。
- 不得修改程式讓預覽成功。
- 不得安裝 Playwright、瀏覽器或其他測試工具。

### Production build 限制

先閱讀 `package.json` 中實際的 build、prebuild、postbuild script。

只有同時符合以下條件才可執行：

1. 所需依賴已存在，不需要安裝。
2. build output 可明確導向本輪專案外暫存目錄。
3. build、prebuild、postbuild 不會產生或修改專案內檔案。
4. 不會清空或覆寫既有 `dist`。

若是標準 Vite build，可依實際 script 評估把 `outDir` 指向暫存目錄；不得未經確認直接照抄命令。

不符合任一條件時，Production build 標示 `NOT_TESTED` 並說明原因。

建置失敗只記錄實際錯誤，不得修正。

### 隱私

- 可以記錄環境變數檔名、變數名稱及程式引用位置。
- 不得輸出環境變數值。
- 不得輸出私人聯絡方式、token、secret 或帳號憑證。

## Goal

### 1. 確認專案與規則載入

回報：

- `pwd -P` 或等效的實際專案路徑。
- `AGENTS.md` 是否完整讀取。
- Skill 是否完整讀取。
- 工程計畫是否完整讀取。
- 參考影片的實際路徑、格式、大小、解析度與時長。
- Node 版本。
- npm、pnpm 或 yarn 的實際可用版本。
- macOS 與架構資訊（只記錄與建置相關的基本資訊）。

### 2. 盤點套件與指令

實際讀取：

- `package.json`
- lockfile
- `vite.config.*`
- Vue／Vite 版本
- dependencies
- devDependencies
- Node engine 限制
- dev script
- preview script
- build script
- lint script
- test script
- 是否使用 Vue Router
- 是否已有動畫相關套件
- 是否已有瀏覽器／E2E 測試工具

不得輸出完整 `node_modules` 清單。

### 3. 建立專案架構摘要

使用實際路徑整理：

- app entry
- `App`
- router
- views
- components
- data
- composables
- utils
- 全域樣式
- 區域樣式
- `public`
- `src/assets`
- 圖片
- 影片
- 字體
- 圖示
- 環境變數讀取位置
- 專案文件

若某個常見資料夾不存在，明確標示 `NOT_FOUND`。

不要把推測的未來元件寫成目前架構。

### 4. 建立既有功能 Owner Map

定位下列功能的實際 owner：

- Hero
- Showreel／影片播放器
- Hero 捲動效果
- 導覽
- 短片服務
- 長片服務
- 航拍素材服務
- 服務卡展開與收合
- 價格
- 交付時間
- 短片長期合作
- 合作流程
- 合作流程動畫
- 方案推薦工具
- 五題推薦流程
- 推薦計算邏輯
- 聯絡方式
- 環境變數顯示條件

輸出：

| 功能 | UI owner | 資料／邏輯 owner | 關鍵 state／function | 耦合與重構風險 |
|---|---|---|---|---|

每一列必須附實際路徑。找不到時標示 `NOT_FOUND`，不得猜測。

### 5. 核對正式商業資料

以專案 Skill「正式商業資料」為唯一核對基準。

逐項檢查：

- 短片價格與交付時間
- 短片長期合作
- 長片價格、包含內容與交付時間
- 長片沒有長期合作方案
- 航拍的車馬費與每 5 分鐘計價
- 「合作流程」名稱與各階段
- 確認範圍內修改至滿意
- 規格變更時重新確認排程與費用
- 推薦工具不送出、不儲存
- 聯絡方式只顯示已設定的環境變數

輸出：

| 項目 | Skill 正式規格 | 目前實作 | owner path | 結果 |
|---|---|---|---|---|

結果只能使用：

- `MATCH`
- `MISMATCH`
- `NOT_FOUND`
- `NOT_TESTED`

本輪不得修正任何差異。

### 6. 盤點作品與資產

區分：

- 真實作品
- Showreel
- 作品封面
- Hero／背景素材
- UI 裝飾
- 圖示
- 字體
- 開發 placeholder
- 工程參考素材
- 無法確認用途的資產

影片至少記錄：

- 相對與絕對路徑
- 格式
- 解析度
- 時長
- 檔案大小
- 實際引用位置
- 是否會在初始頁載入

主要圖片至少記錄：

- 相對路徑
- 格式
- 寬高
- 檔案大小
- 實際引用位置
- 是否為 runtime asset

不能從實際引用或內容確認用途時，標示「推測」，不得計入真實作品。

最後統計：

- 可確認真實作品數
- 可確認 Showreel 數
- 可確認作品封面數
- 短片作品數
- 長片作品數
- 航拍作品數
- placeholder 數
- 工程參考影片數
- 無法確認用途的資產數

### 7. 檢查 Git 與回復能力

執行唯讀確認：

- 是否為 Git repository
- 是否存在父層 Git repository
- 是否存在 `.gitignore`
- 目前有哪些大型檔案可能不適合未來納入 Git
- `Docs/PortfolioRebuild/reference-portfolio-site.mov` 的目前 Git 可見狀態

若不是 Git repository：

- `git diff --check` 標示 `NOT_TESTED`
- 不得執行 `git init`
- 不得建立 baseline commit
- 只提出 Phase 0B 的安全回復方案

Phase 0B 建議至少比較：

1. 初始化 Git 並建立基準。
2. 建立完整專案副本。
3. 兩者的回復能力、風險與空間成本。

不得在本輪執行任何方案。

### 8. 建立修改前畫面基準

只有既有預覽可安全使用時才執行。

擷取：

- Desktop：寬 1440px
- Tablet：寬 768px
- Mobile：寬 390px

每個 viewport 至少一張完整頁面截圖，保存至本輪暫存目錄。

逐一記錄：

- URL
- viewport 寬高
- 截圖路徑
- 擷取時間
- `document.documentElement.scrollWidth`
- `document.documentElement.clientWidth`
- 是否有水平捲動
- 首屏內容順序
- Showreel 是否立即可見
- 服務與價格首次出現位置
- 手機必要資訊是否依賴 hover
- 圖片／影片載入失敗
- Console error
- Console warning

不可用程式碼閱讀代替 runtime 畫面證據。

### 9. 建立既有互動基準

只有預覽可操作時才執行：

- 導覽
- Showreel 播放、暫停與控制
- Hero 捲動效果
- 服務卡展開與收合
- 是否只有選中的服務卡展開
- 合作流程動畫
- 方案推薦五題流程
- 推薦結果
- 推薦工具是否產生 network submission
- 推薦工具是否寫入 cookie、localStorage、sessionStorage 或其他儲存
- 聯絡入口
- 鍵盤 Tab 順序
- Enter／Space 操作
- 可見 focus 樣式
- `prefers-reduced-motion`

方案推薦測試不得輸入或送出私人資料。

若瀏覽器工具不能模擬 reduced-motion，分開回報：

- 靜態程式碼檢查
- Runtime：`NOT_TESTED`

### 10. Production build

依本文件的 Production build 限制執行或標示 `NOT_TESTED`。

若執行，回報：

- 實際命令
- exit code
- 耗時
- 暫存 outDir
- warnings
- errors
- 檢查前後 manifest 是否相同

Build PASS 只代表建置成功，不代表畫面或功能正確。

### 11. 重構影響分析

根據實際盤點整理：

#### 可直接重用

只列出有實際 owner 與證據的：

- Hero 素材
- Showreel／播放器
- 服務資料
- 推薦邏輯
- 聯絡條件
- 現有響應式或 reduced-motion 能力

#### 必須新增

只列出未來需要的能力與候選 owner，不得建立：

- 作品資料模型
- 作品目錄
- 作品分類
- 作品詳情／Lightbox
- 個人檔案
- 焦點鎖定與 scroll lock
- 其他由盤點證據支持的缺口

#### 高風險部分

至少評估：

- 服務資料與 UI 耦合
- 推薦邏輯與 DOM／元件結構耦合
- 聯絡方式錯誤顯示風險
- Hero 動畫與新作品內容衝突
- 多影片初始載入
- 手機資訊依賴 hover
- reduced-motion 缺失
- 沒有 Git 回復基準
- 參考影片位於專案內造成的大檔案風險

#### 作品素材缺口

以實際資產回答：

- 是否達到最低 3 個真實作品
- 是否達到建議 6–9 個作品
- 每個分類是否至少 3 個作品
- 是否具備 poster
- 是否具備 9:16／16:9 封面
- 是否具備真實標題、摘要、平台、時長與負責項目
- 是否有客戶公開授權資訊

不得建議用假作品填補。

### 12. Phase 0B 安全回復建議

本輪只提出方案，不執行。

依實際狀態回答：

- 建議採用 Git、完整副本或兩者並用。
- 建議的 `.gitignore` 範圍。
- `node_modules`、`dist`、`.DS_Store` 與參考 `.mov` 的處理方式。
- 哪些工程文件適合納入未來版本控制。
- 建立基準前必須先處理的阻擋。
- Phase 0B 預計新增或修改的候選檔案。

## Self-Check

每個項目只能標示：

- `PASS`
- `FAIL`
- `NOT_TESTED`

每項都必須附實際證據。

| 檢查項目 | 必要證據 |
|---|---|
| `AGENTS.md` 已讀 | 實際路徑與規則摘要 |
| 專案 Skill 已讀 | 實際路徑與規則摘要 |
| 工程計畫已讀 | 實際路徑與章節確認 |
| 參考影片可讀 | 路徑、格式、大小、解析度、時長 |
| 專案路徑 | `pwd -P` 或等效證據 |
| 檢查前 manifest | 專案外實際路徑與涵蓋範圍 |
| 檢查後 manifest | 專案外實際路徑與涵蓋範圍 |
| 專案零修改 | manifest 比較結果 |
| Production build | 命令、exit code、暫存 outDir；或 NOT_TESTED 原因 |
| `git diff --check` | 非 Git repository 時為 NOT_TESTED |
| Desktop 1440px | URL、viewport、截圖路徑 |
| Tablet 768px | URL、viewport、截圖路徑 |
| Mobile 390px | URL、viewport、截圖路徑 |
| 水平捲動 | 每個 viewport 的 scrollWidth／clientWidth |
| Console error | 實際 Console 記錄 |
| 鍵盤操作 | 實際操作路徑 |
| reduced-motion | Runtime 證據或 NOT_TESTED |
| Hero／Showreel | 實際操作結果 |
| 三種服務 | owner path 與畫面結果 |
| 商業資料 | 逐項 MATCH／MISMATCH |
| 合作流程 | owner path 與操作結果 |
| 推薦工具 | 實際五題操作結果 |
| 不送出／不儲存 | Network／storage 或程式證據 |
| 聯絡方式 | owner path 與環境變數名稱，不得輸出值 |
| Git 回復能力 | 實際 Git 檢查結果 |

## 預計修改檔案

```text
無
```

只允許在專案外暫存目錄產生：

- 檢查前／後 manifest
- 畫面截圖
- 暫存 build output
- 暫存檢查紀錄

## 實際修改檔案

最終回報必須分開列出：

1. 專案內檔案：預期為「無」。
2. 專案外暫存檔案：列出實際路徑。

若任何專案第一方檔案在本輪發生變化：

- 專案零修改標示 `FAIL`
- 列出精確路徑
- 立即停止
- 不得自行還原、刪除或清理

## 風險

最終報告至少涵蓋：

- 不是 Git repository
- 無可回復基準
- 大型參考影片位於專案內
- build 可能寫入專案
- 預覽可能無法安全啟動
- 作品素材不足
- 多影片效能
- 服務資料與 UI 耦合
- 推薦邏輯回歸
- 聯絡條件回歸
- 手機 hover
- reduced-motion
- 無障礙

## 驗收條件

Phase 0A 只有同時符合以下條件才算完成：

1. 完整閱讀 `AGENTS.md`、專案 Skill 與工程計畫。
2. 沒有修改任何專案檔案。
3. 檢查前後 manifest 有可信比較。
4. 所有架構與功能 owner 都附實際路徑。
5. 正式商業資料已逐項核對但未修改。
6. 資產已區分真實作品、runtime asset、placeholder 與工程參考素材。
7. Git 與回復能力有實際證據。
8. 三種 viewport 有畫面證據，或有可信的 `NOT_TESTED` 原因。
9. Production build 有證據，或因唯讀限制標示 `NOT_TESTED`。
10. 所有檢查使用 PASS、FAIL 或 NOT_TESTED。
11. 只提出 Phase 0B 建議，沒有執行。
12. 沒有 commit、push 或部署。

## 最終回報順序

1. Phase 0A 結論。
2. PASS／FAIL／NOT_TESTED 總表。
3. 已載入規則與參考資料。
4. 現況技術架構。
5. 依賴與指令。
6. 功能 Owner Map。
7. 正式商業資料核對。
8. 作品與資產盤點。
9. Desktop／Tablet／Mobile 畫面證據。
10. Console 與水平捲動。
11. 鍵盤與 reduced-motion。
12. Production build。
13. Git 與回復能力。
14. 檢查前後 manifest 比較。
15. 可直接重用。
16. 必須新增。
17. 高風險部分。
18. 作品素材缺口。
19. Phase 0B 安全回復建議。
20. Phase 0B 候選檔案範圍。
21. 預計修改檔案。
22. 實際修改檔案。
23. 建議 commit message。

建議 commit message 僅供未來 Phase 0B 建立基準時參考：

```text
chore: establish portfolio rebuild baseline
```

本輪沒有修改，不得建立 commit。

完成回報後立即停止，等待使用者把完整結果交回 ChatGPT 審查。
