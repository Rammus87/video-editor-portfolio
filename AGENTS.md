# Portfolio Rebuild Project Instructions

## State-Stable Layout / No Layout Jump

- 同一 UI region 的 sibling states（tabs、filters、carousel modes、orientation、plan 或其他等價 state replacement）切換時，不得因內容高度差異使外層區塊明顯變高或變低。
- presentation frame 必須在同一 breakpoint 維持穩定 geometry；state content 應 scale、constrain、reflow、simplify 或 clamp 以適配 frame，而不是讓 frame 跟著 state 改尺寸。
- 固定高度由 UX 與 Art Direction 選擇緊湊、可讀的基準，不得機械採用最高 state，也不得用大量空白填滿較短 state。
- 切換不得造成下一區塊、scroll geometry、周邊 controls 或 CLS-like layout movement；Desktop、Tablet、Mobile 可各有不同 stable geometry，但同一 breakpoint 的 sibling states 必須穩定。
- 明確 Disclosure / Accordion 的展開與收合可改變高度；但同一展開層級內 sibling state 的切換仍不得產生不必要的高度跳動。本規則以本檔為 authoritative owner，不在其他 Skill 重複建立。

在此專案執行任何分析、修改、測試或審查前：

1. 完整閱讀 `.agents/skills/video-editor-portfolio-rebuild/SKILL.md`。
2. 若使用者指定 Phase 任務檔，完整閱讀該 `.md` 後才可操作。
3. 只執行目前指定的單一 Phase，不得提前進入後續階段。
4. 修改前列出預計修改檔案；完成後列出實際修改檔案。
5. 未經使用者明確要求，不得 commit、push 或部署。
6. 所有驗證只能回報 PASS、FAIL 或 NOT_TESTED，並附實際證據；不得用推測取代測試。
7. 若 Phase 任務與專案 Skill 衝突，以該 Phase 中使用者明確提出的較新要求為準，並在回報中指出差異。
