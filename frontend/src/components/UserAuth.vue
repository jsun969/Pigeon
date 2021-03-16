<template>
  <v-main>
    <v-card>
      <v-tabs v-model="tab" grow>
        <v-tab>登录</v-tab>
        <v-tab>注册</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-text-field v-model="loginName" label="用户名"></v-text-field>
          <v-text-field v-model="loginPwd" label="密码" type="password"></v-text-field>
          <v-btn color="primary" elevation="2" large>登录</v-btn>
        </v-tab-item>
        <v-tab-item>
          <v-text-field v-model="registerName" label="用户名" :rules="nameRules"></v-text-field>
          <v-text-field v-model="registerPwd1" label="密码" type="password" :rules="pwdRules"></v-text-field>
          <v-text-field v-model="registerPwd2" label="重复密码" type="password" :rules="rePwdRule"></v-text-field>
          <v-text-field v-model="inviteCode" label="邀请码"></v-text-field>
          <v-btn color="primary" elevation="2" large @click="logpwd2">注册</v-btn>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-main>
</template>

<script>
export default {
  name: 'UserAuth',
  data: () => ({
    tab: 1,
    loginName: '',
    loginPwd: '',
    registerName: '',
    registerPwd1: '',
    registerPwd2: '',
    nameRules: [
      value => (value || '').length <= 20 || !value || '最多20个字符',
      value => (value || '').length >= 4 || !value || '至少4个字符',
      value => {
        const pattern = /^[a-zA-Z0-9_-]{4,16}$/;
        return pattern.test(value) || !value || '用户名无效';
      },
    ],
    pwdRules: [
      value => (value || '').length <= 60 || !value || '最多60个字符',
      value => (value || '').length >= 10 || !value || '至少10个字符',
      value => {
        const pattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
        return pattern.test(value) || !value || '密码无效';
      },
    ],
  }),
  methods: {
    logpwd2() {
      console.log(this.pwd2Rules);
    },
  },
  computed: {
    rePwdRule() {
      return [this.registerPwd1 === this.registerPwd2 || '重复密码不正确'];
    },
  },
};
</script>

<style lang="scss">
.v-main__wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  .v-card {
    height: 400px;
    width: 400px;
    .v-window-item {
      padding: 40px;
      height: 320px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }
}
</style>
