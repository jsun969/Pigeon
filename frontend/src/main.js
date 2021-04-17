import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';

Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:3000'),
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
    },
  })
);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
