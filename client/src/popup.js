import Vue from 'vue';
import Popup from './Popup.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';

Vue.config.productionTip = false;

const socket = io('http://127.0.0.1:3000');

Vue.use(VueSocketIOExt, socket);

new Vue({
  store,
  vuetify,
  render: h => h(Popup),
}).$mount('#app');
