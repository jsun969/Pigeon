<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>飞鸽传书</v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="isLogin">欢迎您 , {{ loginUsername }}</span>
      <v-btn icon v-if="isLogin" @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <UserAuth
        v-if="!isLogin"
        @register-success="regSuccess"
        @register-error="regError"
        @server-error="serverError"
        @login-success="loginSuccess"
        @login-error="loginError"
      />
      <Main v-else />
    </v-main>
    <Dialog :showDialog="dialogOpen" :mainText="dialogText" :titleStyle="dialogStyle" @close="closeDialog" />
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
    isLogin: false,
    loginUsername: null,
    dialogOpen: false,
    dialogText: '',
    dialogStyle: true,
    dialogLoginSuccess: false,
  }),
  async created() {
    try {
      const {
        status,
        data: { username },
      } = (await axios.post(`${this.$store.state.reqUrl}/user/token-verify`, { auth: localStorage.getItem('userToken') })) || {};
      this.isLogin = status === 200;
      this.loginUsername = username;
    } catch (error) {
      return;
    }
  },
  methods: {
    regSuccess() {
      this.dialogOpen = true;
      this.dialogStyle = true;
      this.dialogText = '注册成功 , 请前往登陆';
    },
    regError(msg) {
      this.dialogOpen = true;
      this.dialogStyle = false;
      const errMsg = {
        InviteCodeNotFound: '邀请码不合法',
        InviteCodeIsUsed: '邀请码已失效',
        DuplicateUsername: '用户名已被使用',
      };
      this.dialogText = `注册失败 , ${errMsg[msg]}`;
    },
    loginSuccess(username) {
      this.dialogOpen = true;
      this.dialogStyle = true;
      this.dialogText = '登陆成功';
      this.loginUsername = username;
      this.dialogLoginSuccess = true;
    },
    loginError() {
      this.dialogOpen = true;
      this.dialogStyle = false;
      this.dialogText = '登陆失败 , 请检查用户名和密码';
    },
    serverError(msg) {
      this.dialogOpen = true;
      this.dialogStyle = false;
      this.dialogText = `服务器错误 , ${msg}`;
    },
    closeDialog() {
      this.dialogOpen = false;
      this.isLogin = this.dialogLoginSuccess;
    },
    logout() {
      localStorage.removeItem('userToken');
      this.isLogin = false;
    },
  },
};
</script>
