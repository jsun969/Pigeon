import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    reqUrl: 'http://localhost:3000',
    isLogin: false,
    dialog: {
      open: false,
      text: '',
      style: 0,
      value: '',
    },
  },
  mutations: {},
  actions: {},
  modules: {},
});
