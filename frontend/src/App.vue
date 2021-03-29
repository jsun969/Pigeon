<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>飞鸽传书</v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="$store.state.isLogin">欢迎您 , {{ loginUsername }}</span>
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
    loginUsername: null,
    dialogLoginSuccess: false,
  }),
  async created() {
    try {
      const {
        status,
        data: { username },
      } = (await axios.post(`${this.$store.state.reqUrl}/user/token-verify`, { auth: localStorage.getItem('userToken') })) || {};
      this.$store.state.isLogin = status === 200;
      this.loginUsername = username;
    } catch (error) {
      return;
    }
  },
  methods: {
    regSuccess() {
      this.$store.state.dialog.open = true;
      this.$store.state.dialog.style = 0;
      this.$store.state.dialog.text = '注册成功 , 请前往登陆';
    },
    regError(msg) {
      this.$store.state.dialog.open = true;
      this.$store.state.dialog.style = 1;
      const errMsg = {
        InviteCodeNotFound: '邀请码不合法',
        InviteCodeIsUsed: '邀请码已失效',
        DuplicateUsername: '用户名已被使用',
      };
      this.$store.state.dialog.text = `注册失败 , ${errMsg[msg]}`;
    },
    loginSuccess(username) {
      this.$store.state.dialog.open = true;
      this.$store.state.dialog.value = 'login';
      this.$store.state.dialog.style = 0;
      this.$store.state.dialog.text = '登陆成功';
      this.loginUsername = username;
      this.dialogLoginSuccess = true;
    },
    loginError() {
      this.$store.state.dialog.open = true;
      this.$store.state.dialog.style = 1;
      this.$store.state.dialog.text = '登陆失败 , 请检查用户名和密码';
    },
    serverError(msg) {
      this.$store.state.dialog.open = true;
      this.$store.state.dialog.style = 1;
      this.$store.state.dialog.text = `服务器错误 , ${msg}`;
    },
    closeDialog() {
      this.$store.state.dialog.open = false;
      if (this.$store.state.dialog.value === 'login') {
        this.$store.state.isLogin = this.dialogLoginSuccess;
      }
    },
    confirmCloseDialog() {
      this.$store.state.dialog.open = false;
      if (this.$store.state.dialog.value === 'logout') {
        localStorage.removeItem('userToken');
        this.$store.state.isLogin = false;
        this.$router.push({ name: 'Home' });
      }
    },
    refuseCloseDialog() {
      this.$store.state.dialog.open = false;
    },
  },
};
</script>
