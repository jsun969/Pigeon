import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    reqUrl: 'http://localhost:3000',
    isLogin: false,
  },
  mutations: {},
  actions: {},
  modules: {},
});
