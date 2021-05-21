import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';

Vue.config.productionTip = false;

const socket = io('http://127.0.0.1:3000');

Vue.use(VueSocketIOExt, socket, { store });

axios.defaults.baseURL = 'http://localhost:3000';

document.title = '飞鸽传书';

new Vue({
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
