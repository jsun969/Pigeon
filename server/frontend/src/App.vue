<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>飞鸽传书</v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="this.isLogin">欢迎您 , {{ this.userFullName }}老师</span>
    </v-app-bar>
    <UserAuth v-if="!this.isLogin" />
    <Main v-else />
    <Dialog
      :showDialog="this.dialog.open"
      :mainText="this.dialog.text"
      :titleStyle="this.dialog.style"
      @close="closeDialog"
      @confirmClose="confirmCloseDialog"
      @refuseClose="refuseCloseDialog"
    />
  </v-app>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import UserAuth from './components/UserAuth';
import Main from './components/Main';
import Dialog from './components/Dialog';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    UserAuth,
    Main,
    Dialog,
  },
  async mounted() {
    this.getAllDevices();
    try {
      const {
        status,
        data: { fullName },
      } = (await axios.post('/user/token-verify', { auth: localStorage.getItem('userToken') })) || {};
      if (status === 200) {
        this.userLogin({ value: true });
        axios.defaults.headers.common['auth'] = localStorage.getItem('userToken');
        this.setFullName({ fullName });
      }
    } catch (error) {
      return;
    }
  },
  sockets: {
    connect() {
      this.$socket.client.emit('userCreated', { auth: localStorage.getItem('userToken') });
    },
  },
  methods: {
    closeDialog() {
      this.hideDialog();
      const { value } = this.dialog;
      if (value === 'LoginSuccess') {
        this.userLogin({ value: true });
      } else if (value === 'ChangeFullNameSuccess') {
        this.setFullName({ fullName: this.newFullNameWhenChange });
      }
    },
    confirmCloseDialog() {
      this.hideDialog();
      const { value } = this.dialog;
      if (value === 'Logout') {
        localStorage.removeItem('userToken');
        this.userLogin({ value: false });
        this.$router.push({ name: 'Home' });
      } else if (value.name === 'removeDevice') {
        this.$socket.client.emit('removeDevice', { auth: localStorage.getItem('userToken'), code: value.code });
        this.removeDevice({ code: value.code });
      }
    },
    refuseCloseDialog() {
      this.hideDialog();
    },
    ...mapMutations(['hideDialog', 'userLogin', 'setFullName', 'removeDevice', 'getAllDevices']),
  },
  computed: {
    ...mapState(['isLogin', 'userFullName', 'dialog', 'newFullNameWhenChange']),
  },
};
</script>
