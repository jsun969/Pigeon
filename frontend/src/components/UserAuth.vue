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
          <v-btn color="primary" elevation="2" large :disabled="isLoginBtnDisabled">登录</v-btn>
        </v-tab-item>
        <v-tab-item>
          <v-text-field v-model="registerName" label="用户名" :rules="nameRules" @update:error="isRegNameErr = $event"></v-text-field>
          <v-text-field v-model="registerPwd1" label="密码" type="password" :rules="pwdRules" @update:error="isRegPwd1Err = $event"></v-text-field>
          <v-text-field
            v-model="registerPwd2"
            label="重复密码"
            type="password"
            :rules="rePwdRule"
            @update:error="isRegPwd2Err = $event"
          ></v-text-field>
          <v-text-field v-model="inviteCode" label="邀请码"></v-text-field>
          <v-btn color="primary" elevation="2" large @click="register" :disabled="isRegBtnDisabled">注册</v-btn>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-main>
</template>

<script>
import axios from 'axios';

const URL = 'http://localhost:3000';

export default {
  name: 'UserAuth',
  data: () => ({
    tab: null,
    loginName: '',
    loginPwd: '',
    registerName: '',
    isRegNameErr: false,
    registerPwd1: '',
    isRegPwd1Err: false,
    registerPwd2: '',
    isRegPwd2Err: false,
    inviteCode: '',
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
        return pattern.test(value) || !value || '密码无效 , 大小写字母+数字';
      },
    ],
  }),
  methods: {
    register() {
      const userData = {
        username: this.registerName,
        password: this.registerPwd1,
        inviteCode: this.inviteCode,
      };
      axios
        .post(`${URL}/user/register`, userData)
        .then(res => {
          if ((res.status === 200)) {
            this.$emit('register-success');
          }
        })
        .catch();
    },
  },
  computed: {
    rePwdRule() {
      return [this.registerPwd1 === this.registerPwd2 || '重复密码不正确'];
    },
    isRegBtnDisabled() {
      const isEmpty = !this.registerName || !this.registerPwd1 || !this.registerPwd2 || !this.inviteCode;
      const haveError = this.isRegNameErr || this.isRegPwd1Err || this.isRegPwd2Err;
      return isEmpty || haveError;
    },
    isLoginBtnDisabled() {
      return !this.loginName || !this.loginPwd;
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
    width: 360px;
    margin: 0px 20px;
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
