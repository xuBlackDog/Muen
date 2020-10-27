import { count } from "api/public/type.js";
const state = {
  types: [],
  foodtypes: [],
};
const mutations = {
  SET_TYPE(state, data) {
    state.types = data;
  },
  SET_FOODTYPES(state, data) {
    state.foodtypes = data;
  },
  PUSH_TYPES(state, data) {
    state.types.push(data);
  },
  PUSH_FOODTYPES(state, data) {
    state.foodtypes.push(data);
  },
  // GET_COUNT(state, data) {
  //   state.types = data;
  // },
};
// 在main.js中引入了axios并修改了原型链，
// 在store/index.js中也不能直接使用this.$ajax，而是要引入axios后再使用。
const actions = {
  // get_count({ commit }, data) {
  //   commit("GET_COUNT", data);
  // },
};
const TabModule = {
  state,
  mutations,
  actions,
};
export default TabModule;
