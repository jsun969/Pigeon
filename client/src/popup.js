import Vue from 'vue';
import Popup from './Popup.vue';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  render: h => h(Popup),
}).$mount('#app');
