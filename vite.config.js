import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite 設定ファイル
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,       // ポートを固定
    strictPort: true, // 他プロセスで使用中ならエラーにする
    hmr: {
      protocol: "ws", // WebSocketを明示
      host: "localhost",
      port: 5173
    }
  }
});

