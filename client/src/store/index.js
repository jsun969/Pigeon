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
    messages: [],
  },
  mutations: {
    popUp(state, payload) {
      state.messages.push({ fullName: payload.from, message: payload.message, time: Date.now() });
      state.popUp.from = payload.from;
      state.popUp.message = payload.message;
      ipcRenderer.send('createPopUp', { width: payload.width, height: payload.height, id: payload.id });
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
    async getMessages() {
      try {
        const { status, data } = (await axios.get('/device/messages', { params: { code: this.state.code } })) || {};
        if (status === 200) {
          this.state.messages = data;
        }
      } catch {
        return;
      }
    },
  },
  modules: {},
  getters: {
    messagesRev: state => state.messages.map(item => ({ ...item, isActive: false })).reverse(),
    messagesCnt: state => state.messages.length,
  },
});
