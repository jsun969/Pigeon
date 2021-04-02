import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    reqUrl: 'http://localhost:3000',
    isLogin: false,
    dialog: {
      value: '',
      open: false,
      text: '',
      style: 0,
    },
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
    closeDialog(state) {
      state.dialog.open = false;
    },
  },
  actions: {},
  modules: {},
});
