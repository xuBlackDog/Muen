import Vue from "vue";
import Vuex from "vuex";
import TabModule from "./types/idnex.js";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    wx_url: "http://7a73-zsh-9oual-1302800863.tcb.qcloud.la/menu/",
  },
  modules: {
    TabModule,
  },
});
