import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    dialog: {
      value: '',
      open: false,
      text: '',
      style: 0,
    },
    userFullName: null,
    // 确定弹窗后修改前端新姓名的一个临时的全局变量 还没找到别的方法
    newFullNameWhenChange: null,
    devices: [
      { code: 114514, name: '初三16班', status: 0, editing: false, editingName: '' },
      { code: 458962, name: '初一99班', status: 1, editing: false, editingName: '' },
      { code: 898919, name: '不知道几班', status: 2, editing: false, editingName: '' },
    ],
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
    startEditing(state, payload) {
      state.devices[payload.index].editing = true;
      state.devices[payload.index].editingName = state.devices[payload.index].name;
    },
    stopEditing(state, payload) {
      state.devices[payload.index].editing = false;
    },
    addDevice(state, payload) {
      const { code, name } = payload;
      state.devices.unshift({ code, name, status: 2, editing: false, editingName: '' });
    },
  },
  getters: {
    onlineDevicesName: state => {
      return state.devices.filter(({ status }) => status === 0).map(({ name }) => name);
    },
  },
  actions: {},
  modules: {},
});
