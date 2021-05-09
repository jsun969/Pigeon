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
      // 弹窗关闭返回给服务器 待完善
      // windows: {},
    },
  },
  mutations: {
    popUp(state, payload) {
      state.popUp.from = payload.from;
      state.popUp.message = payload.message;
      ipcRenderer.send('createPopUp', { width: payload.width, height: payload.height });
      // 弹窗关闭返回给服务器 待完善
      // ipcRenderer.on('pop-up-window-id', (event, arg) => {
      //   state.popUp.windows[arg] = payload.id;
      // });
    },
    // 弹窗关闭返回给服务器 待完善
    // popUpWindowClosed(state, payload) {
    //   this._vm.$socket.client.emit('messageClosed', { id: state.popUp.windows[payload.id] });
    // },
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
