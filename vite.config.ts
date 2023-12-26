import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    //host: '0.0.0.0',
    //port: 8099,
    proxy: {
      "/api": {
        //target: "http://syt.atguigu.cn",
        //target: "http://localhost:52774/",
        target: "http://119.3.235.244:52773/",
        changeOrigin: true,
      },
    },
  },
});
