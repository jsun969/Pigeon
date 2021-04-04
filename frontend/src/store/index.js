import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    dialog: {
      value: '',
      open: false,
      text: '',
      style: 0,
    },
    userFullName: null,
    // 确定弹窗后修改前端新姓名的一个临时的全局变量 还没找到别的方法
    newFullNameWhenChange: null,
  },
  mutations: {
    userLogin(state, payload) {
      state.isLogin = payload.value;
    },
    showDialog(state, payload) {
      state.dialog.open = true;
      state.dialog.value = payload.value;
      state.dialog.style = payload.style;
      state.dialog.text = payload.text;
    },
    hideDialog(state) {
      state.dialog.open = false;
    },
    setFullName(state, payload) {
      state.userFullName = payload.fullName;
    },
    setNewFullNameWhenChange(state, payload) {
      state.newFullNameWhenChange = payload.fullName;
    },
  },
  actions: {},
  modules: {},
});
