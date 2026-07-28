# 作品集影片素材

請先將實際作品集影片保存在此資料夾，方便統一管理：

`src/assets/showreel.mp4`

發佈前請將同一檔案複製到 `public/showreel.mp4`，並在專案根目錄的 `.env` 加入 `VITE_SHOWREEL_URL=/showreel.mp4`。Hero 區會以原生 HTML `<video>` 自動播放、靜音循環。未提供影片時，頁面會顯示明確的素材提示，不會以靜態假播放器取代。
