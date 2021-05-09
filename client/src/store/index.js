import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import { ipcRenderer } from 'electron';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    code: null,
    popUp: {
      from: null,
      message: null,
    },
  },
  mutations: {
    popUp(state, payload) {
      state.popUp.from = payload.from;
      state.popUp.message = payload.message;
      ipcRenderer.send('createPopUp', { width: payload.width, height: payload.height });
    },
  },
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
