import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import { ipcRenderer } from 'electron';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({ key: ['popUp'] })],
  state: {
    code: null,
    popUp: {
      from: null,
      message: null,
    },
    messages: [],
    users: [],
  },
  mutations: {
    popUp(state, payload) {
      state.messages.push({ fullName: payload.from, message: payload.message, time: Date.now(), username: payload.username });
      state.popUp.from = payload.from;
      state.popUp.message = payload.message;
      ipcRenderer.send('createPopUp', { width: payload.width, height: payload.height, id: payload.id });
    },
    changeMessageFullName(state, payload) {
      state.messages
        .filter(({ username }) => username === payload.username)
        .forEach(message => (message.fullName = payload.newFullName));
    },
  },
  actions: {
    async getDeviceData() {
      try {
        const {
          status,
          data: { code, messages, users },
        } = (await axios.get('/device/data', { params: { pcId: ipcRenderer.sendSync('getPcId') } })) || {};
        if (status === 200) {
          this.state.code = code;
          this.state.messages = messages;
          this.state.users = users;
        }
      } catch {
        this.state.code = '网络错误';
      }
    },
  },
  modules: {},
  getters: {
    messagesRev: state => state.messages.map(item => ({ ...item, isActive: false })).reverse(),
    messagesCnt: state => state.messages.length,
  },
});
