import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { ipcRenderer } from 'electron';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    code: null,
  },
  mutations: {},
  actions: {
    async getCode() {
      try {
        const {
          status,
          data: { code },
        } = (await axios.get('/device/code', { params: { pcId: ipcRenderer.sendSync('getPcId') } })) || {};
        if (status === 200) {
          this.state.code = code;
        }
      } catch {
        this.state.code = '网络错误';
      }
    },
  },
  modules: {},
});
