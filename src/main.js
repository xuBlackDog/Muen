import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "element-ui/lib/theme-chalk/index.css";
import echarts from "echarts";

Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);
Vue.config.productionTip = false;

Vue.prototype.GLOBAL = global_data; //挂载全局变量

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

import ElementUI from "element-ui";
import "styles/reset.css"; // 重置浏览器默认样式

import global_data from "const/global_data.js";
import "icons"; // 挂载封装好的全局图标
import { encapsulation } from "api/request.js";
Vue.prototype.encapsulation = encapsulation; // 挂载token到全局上

// 导入bootstrap
