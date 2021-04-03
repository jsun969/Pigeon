<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>飞鸽传书</v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="$store.state.isLogin">欢迎您 , {{ loginFullName }}老师</span>
    </v-app-bar>
    <UserAuth
      v-if="!$store.state.isLogin"
      @register-success="regSuccess"
      @register-error="regError"
      @server-error="serverError"
      @login-success="loginSuccess"
      @login-error="loginError"
    />
    <Main v-else />
    <Dialog
      :showDialog="$store.state.dialog.open"
      :mainText="$store.state.dialog.text"
      :titleStyle="$store.state.dialog.style"
      @close="closeDialog"
      @confirmClose="confirmCloseDialog"
      @refuseClose="refuseCloseDialog"
    />
  </v-app>
</template>

<script>
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
  data: () => ({
    loginFullName: null,
    dialogLoginSuccess: false,
  }),
  async created() {
    try {
      const {
        status,
        data: { fullName },
      } = (await axios.post(`${this.$store.state.reqUrl}/user/token-verify`, { auth: localStorage.getItem('userToken') })) || {};
      if (status === 200) {
        this.$store.commit('userLogin', { value: true });
        axios.defaults.headers.common['auth'] = localStorage.getItem('userToken');
        this.loginFullName = fullName;
      }
    } catch (error) {
      return;
    }
  },
  methods: {
    regSuccess() {
      this.$store.commit('showDialog', { value: 'RegisterSuccess', style: 0, text: '注册成功 , 请前往登陆' });
    },
    regError(msg) {
      const errMsg = {
        InviteCodeNotFound: '邀请码不合法',
        InviteCodeIsUsed: '邀请码已失效',
        DuplicateUsername: '用户名已被使用',
      };
      this.$store.commit('showDialog', { value: 'RegisterError', style: 1, text: `注册失败 , ${errMsg[msg]}` });
    },
    loginSuccess(username) {
      this.$store.commit('showDialog', { value: 'LoginSuccess', style: 0, text: '登陆成功' });
      this.loginUsername = username;
      this.dialogLoginSuccess = true;
    },
    loginError() {
      this.$store.commit('showDialog', { value: 'LoginError', style: 1, text: '登陆失败 , 请检查用户名和密码' });
    },
    serverError(msg) {
      this.$store.commit('showDialog', { value: 'ServerError', style: 1, text: `服务器错误 , ${msg}` });
    },
    closeDialog() {
      this.$store.commit('closeDialog');
      if (this.$store.state.dialog.value === 'LoginSuccess') {
        this.$store.commit('userLogin', { value: this.dialogLoginSuccess });
      }
    },
    confirmCloseDialog() {
      this.$store.commit('closeDialog');
      if (this.$store.state.dialog.value === 'Logout') {
        localStorage.removeItem('userToken');
        this.$store.commit('userLogin', { value: false });
        this.$router.push({ name: 'Home' });
      }
    },
    refuseCloseDialog() {
      this.$store.commit('closeDialog');
    },
  },
};
</script>
