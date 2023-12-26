import router from "./router";
// @ts-ignore
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
import useUserStore from '@/store/modules/user';
import pinia from "@/store";
let whiteList = [
  "/home",
  "/hospital/register",
  "/hospital/detail",
  "/hospital/notice",
  "/hospital/close",
  "/hospital/search",
];
let userStore = useUserStore(pinia);
router.beforeEach((to, _, next) => {
  Nprogress.start();
  document.title = `大姚挂号平台-${to.meta.title}`;

  let token = userStore.userInfo.token;
  if (token) {
    next();
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      userStore.visiable = true;
      next({ path: "/home", query: { redirect: to.fullPath } });
    }
  }
});

router.afterEach(() => {
  Nprogress.done();
});
