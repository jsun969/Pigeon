import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: null,
    dialog: { value: '', open: false, text: '', style: 0 },
    userFullName: null,
    // 确定弹窗后修改前端新姓名的一个临时的全局变量 还没找到别的方法
    newFullNameWhenChange: null,
    devices: [],
    messages: [],
    settings: {
      tabs: null,
      tabItems: [
        { icon: 'mdi-information', text: '关于项目' },
        { icon: 'mdi-form-textbox-password', text: '修改密码' },
        { icon: 'mdi-badge-account-horizontal', text: '修改姓名' },
      ],
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
    hideDialog(state) {
      state.dialog.open = false;
    },
    setFullName(state, payload) {
      state.userFullName = payload.fullName;
    },
    setNewFullNameWhenChange(state, payload) {
      state.newFullNameWhenChange = payload.fullName;
    },
    setDeviceName(state, payload) {
      state.devices[payload.index].name = payload.newName;
    },
    startEditingDevice(state, payload) {
      state.devices[payload.index].editing = true;
      state.devices[payload.index].editingName = state.devices[payload.index].name;
    },
    stopEditingDevice(state, payload) {
      state.devices[payload.index].editing = false;
    },
    addDevice(state, payload) {
      state.devices.unshift({ code: payload.code, name: payload.name, status: 2, editing: false, editingName: '' });
    },
    removeDevice(state, payload) {
      state.devices.splice(
        state.devices.findIndex(({ code }) => code === payload.code),
        1
      );
    },
    setDeviceStatus(state, payload) {
      state.devices[state.devices.findIndex(({ code }) => code === payload.code.toString())].status = payload.status;
    },
    getAllDevices(state) {
      this._vm.$socket.client.emit('getDevice', { auth: localStorage.getItem('userToken') }, devices => {
        state.devices = devices.map(({ code, name, status }) => ({ code, name, status, editing: false, editingName: '' }));
      });
    },
    addMessageToHistory(state, payload) {
      console.log(payload);
      state.messages.push(payload);
    },
    updateSettingsTabs(state, value) {
      state.settings.tabs = value;
    },
    setMessages(state, payload) {
      state.messages = payload.messages;
    },
    // SocketIO
    SOCKET_DEVICEONLINE(state, { code }) {
      state.devices[state.devices.findIndex(({ code: codeTmp }) => codeTmp === code)].status = 0;
    },
    SOCKET_DEVICEOFFLINE(state, { code }) {
      state.devices[state.devices.findIndex(({ code: codeTmp }) => codeTmp === code)].status = 1;
    },
    SOCKET_MESSAGECLOSEDTOUSER(state, { id }) {
      state.messages[state.messages.findIndex(({ id: idTmp }) => idTmp === id)].status = false;
    },
  },
  getters: {
    messagesRev: state =>
      state.messages
        .map((item, index, arr) => ({
          ...item,
          devicesRemark: item.devices.map(deviceCode => (state.devices.find(({ code }) => code === deviceCode) || {}).name),
          isActive: index >= arr.length - 10 ? true : false,
        }))
        .reverse(),
  },
  actions: {},
  modules: {},
});
