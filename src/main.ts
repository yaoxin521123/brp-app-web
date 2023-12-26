import { createApp } from "vue";
import "@/style/reset.scss";
import App from "@/App.vue";
import HosptialTop from "@/components/hospital_top/index.vue";
import HosptialBottom from "@/components/hospital_bottom/index.vue";
import Login from "@/components/login/index.vue";

import Visitor from "@/components/visitor/visitor.vue";
import router from "@/router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//@ts-ignore
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import pinia from "@/store";
const app = createApp(App);
app.component("HosptialTop", HosptialTop);
app.component("HosptialBottom", HosptialBottom);
app.component("Login", Login);
app.component("Visitor", Visitor);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(pinia);
import './permisstion'
app.mount("#app");
