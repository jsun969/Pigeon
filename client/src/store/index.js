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
    snackbar: {
      show: false,
      timer: null,
      lastTimes: 30,
    },
    newUser: {
      name: null,
      id: null,
      remark: null,
      full: null,
    },
  },
  mutations: {
    popUp(state, payload) {
      state.messages.push({ fullName: payload.from, message: payload.message, time: Date.now(), username: payload.username });
      state.popUp.from = payload.from;
      state.popUp.message = payload.message;
      ipcRenderer.send('createPopUp', { width: payload.width, height: payload.height, id: payload.id });
    },
    acceptAddUser(state) {
      clearTimeout(state.snackbar.timer);
      state.snackbar.show = false;
      this._vm.$socket.client.emit('allowAddDevice', {
        result: true,
        code: state.code,
        remarkName: state.newUser.remark,
        id: state.newUser.id,
      });
      state.users.push({ fullName: state.newUser.full, username: state.newUser.name });
    },
    refuseAddUser(state) {
      clearTimeout(state.snackbar.timer);
      state.snackbar.show = false;
      this._vm.$socket.client.emit('allowAddDevice', {
        result: false,
        code: state.code,
        remarkName: state.newUser.remark,
        id: state.newUser.id,
      });
    },
    removeUser(state, payload) {
      state.users.splice(payload.index, 1);
    },
    // Socket IO
    SOCKET_DEVICEADDREQ(state, { fullName, remarkName, id, username }) {
      state.newUser.full = fullName;
      state.newUser.id = id;
      state.newUser.remark = remarkName;
      state.newUser.name = username;
      state.snackbar.show = true;
      state.snackbar.lastTimes = 30;
      const countdown = () => {
        state.snackbar.timer = setTimeout(() => {
          if (state.snackbar.lastTimes > 0) {
            state.snackbar.lastTimes--;
            countdown();
          } else {
            clearTimeout(state.snackbar.timer);
          }
        }, 1000);
      };
      countdown();
    },
    SOCKET_REMOVEDEVICEHOTUPDATE(state, { name }) {
      state.users.splice(
        state.users.findIndex(({ username }) => username === name),
        1
      );
    },
    SOCKET_CHANGEFULLNAMEHOTUPDATE(state, { username, newFullName }) {
      state.messages.filter(({ username }) => username === username).forEach(message => (message.fullName = newFullName));
      state.users[state.users.findIndex(({ username: usernameTmp }) => username === usernameTmp)].fullName = newFullName;
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
