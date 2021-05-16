<template>
  <v-main>
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-card :height="tab ? 500 : 300" width="320" style="margin:0px 20px">
          <v-tabs v-model="tab" grow>
            <v-tab>登录</v-tab>
            <v-tab>注册</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" style="padding:20px">
            <v-tab-item>
              <v-text-field v-model="loginName" label="用户名" @keyup.enter="login"></v-text-field>
              <v-text-field
                v-model="loginPwd"
                label="密码"
                :type="showLoginPwd ? 'text' : 'password'"
                @keyup.enter="login"
                :append-icon="showLoginPwd ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showLoginPwd = !showLoginPwd"
              ></v-text-field>
              <v-btn block color="primary" elevation="2" large :disabled="!loginName || !loginPwd" @click="login">登录</v-btn>
            </v-tab-item>
            <v-tab-item>
              <v-text-field
                v-model="registerFullName"
                label="姓名"
                :rules="fullNameRules"
                @update:error="isRegErr = $event"
                @keyup.enter="register"
              ></v-text-field>
              <v-text-field
                v-model="registerName"
                label="用户名"
                :rules="nameRules"
                @update:error="isRegErr = $event"
                @keyup.enter="register"
              ></v-text-field>
              <v-text-field
                v-model="registerPwd1"
                label="密码"
                :type="showRegPwd ? 'text' : 'password'"
                :rules="pwdRules"
                @update:error="isRegErr = $event"
                @keyup.enter="register"
                :append-icon="showRegPwd ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showRegPwd = !showRegPwd"
                counter
              >
              </v-text-field>
              <v-text-field
                v-model="registerPwd2"
                label="重复密码"
                :type="showRegPwd ? 'text' : 'password'"
                :rules="[registerPwd1 === registerPwd2 || !registerPwd2 || '重复密码不正确']"
                @update:error="isRegErr = $event"
                @keyup.enter="register"
                :append-icon="showRegPwd ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showRegPwd = !showRegPwd"
                :counter="registerPwd1.length"
              ></v-text-field>
              <v-text-field v-model="registerInviteCode" label="邀请码" @keyup.enter="register"></v-text-field>
              <v-btn
                block
                color="primary"
                elevation="2"
                large
                @click="register"
                :disabled="!registerName || !registerPwd1 || !registerPwd2 || !registerInviteCode || isRegErr"
                >注册</v-btn
              >
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapMutations } from 'vuex';
import axios from 'axios';

export default {
  name: 'UserAuth',
  data: () => ({
    tab: 0,
    loginName: '',
    loginPwd: '',
    showLoginPwd: false,
    registerFullName: '',
    registerName: '',
    showRegPwd: false,
    registerPwd1: '',
    registerPwd2: '',
    isRegErr: false,
    registerInviteCode: '',
    // 待做:用户密码复杂度检测
    fullNameRules: [
      value => (value || '').length <= 20 || !value || '最多20个字符',
      value => (value || '').length >= 2 || !value || '至少2个字符',
      value => {
        // 支持中文名(包括少数民族)
        const pattern = /^[\u4E00-\u9FA5]+(·[\u4E00-\u9FA5]+)*$/;
        return pattern.test(value) || !value || '姓名无效';
      },
    ],
    nameRules: [
      value => (value || '').length <= 10 || !value || '最多10个字符',
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
    async register() {
      if (this.isRegBtnDisabled) return;
      try {
        const {
          registerFullName: fullName,
          registerName: username,
          registerPwd1: password,
          registerInviteCode: inviteCode,
        } = this;
        const userData = { fullName, username, password, inviteCode };
        const { status } = (await axios.post('/user/register', userData)) || {};
        if (status === 201) {
          this.showDialog({ value: 'RegisterSuccess', style: 0, text: '注册成功 , 请前往登陆' });
        }
      } catch ({
        response: {
          status,
          data: { error },
        },
      }) {
        if (status === 404) {
          const errMsg = {
            InviteCodeNotFound: '邀请码不合法',
            InviteCodeIsUsed: '邀请码已失效',
            DuplicateUsername: '用户名已被使用',
          };
          this.showDialog({ value: 'RegisterError', style: 1, text: `注册失败 , ${errMsg[error]}` });
        } else if (status === 500) {
          this.showDialog({ value: 'ServerError', style: 1, text: `服务器错误 , ${error.code}` });
        }
      }
      this.registerName = '';
      this.registerPwd1 = '';
      this.registerPwd2 = '';
      this.registerInviteCode = '';
    },
    async login() {
      if (this.isLoginBtnDisabled) return;
      try {
        const { loginName: username, loginPwd: password } = this;
        const userData = { username, password };
        const {
          status,
          data: { token, fullName },
        } = (await axios.post('/user/login', userData)) || {};
        if (status === 200) {
          localStorage.setItem('userToken', token);
          this.setFullName({ fullName });
          axios.defaults.headers.common['auth'] = token;
          this.showDialog({ value: 'LoginSuccess', style: 0, text: '登陆成功' });
        }
      } catch ({
        response: {
          status,
          data: { error },
        },
      }) {
        if (status === 404) {
          this.showDialog({ value: 'LoginError', style: 1, text: '登陆失败 , 请检查用户名和密码' });
        } else if (status === 500) {
          this.showDialog({ value: 'ServerError', style: 1, text: `服务器错误 , ${error.code}` });
        }
      }
      this.loginName = '';
      this.loginPwd = '';
    },
    ...mapMutations(['showDialog', 'setFullName']),
  },
};
</script>
