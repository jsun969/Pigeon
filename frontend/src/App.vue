<template>
  <v-app>
    <v-app-bar app color="primary" dark>飞鸽传书</v-app-bar>
    <v-main>
      <UserAuth v-if="isLogin" @register-success="regSuccess" @register-error="regError" @server-error="serverError" />
      <Main v-else />
    </v-main>
    <Dialog :showDialog="dialogOpen" :mainText="dialogText" :titleStyle="dialogStyle" @close="dialogOpen = false" />
  </v-app>
</template>

<script>
import UserAuth from './components/UserAuth';
import Main from './components/Main';
import Dialog from './components/Dialog';
export default {
  name: 'App',
  components: {
    UserAuth,
    Main,
    Dialog,
  },
  data: () => ({
    isLogin: true,
    dialogOpen: false,
    dialogText: '',
    dialogStyle: true,
  }),
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
    serverError(msg) {
      this.dialogOpen = true;
      this.dialogStyle = false;
      this.dialogText = `服务器错误 , ${msg}`;
    },
  },
};
</script>
