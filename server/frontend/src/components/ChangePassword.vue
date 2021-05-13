<template>
  <v-container>
    <v-row>
      <v-text-field
        v-model="oldPassword"
        label="原密码"
        outlined
        @update:error="isNewPwdErr = $event"
        :append-icon="showOldPwd ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showOldPwd ? 'text' : 'password'"
        @click:append="showOldPwd = !showOldPwd"
      ></v-text-field>
    </v-row>
    <v-row>
      <v-text-field
        v-model="newPassword1"
        label="新密码"
        outlined
        :rules="[...pwdRules, newPassword1 !== oldPassword || !newPassword1 || '与原密码相同']"
        @update:error="isNewPwdErr = $event"
        :append-icon="showNewPwd ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showNewPwd ? 'text' : 'password'"
        @click:append="showNewPwd = !showNewPwd"
        counter
      ></v-text-field>
    </v-row>
    <v-row>
      <v-text-field
        v-model="newPassword2"
        label="重复密码"
        outlined
        :rules="[newPassword1 === newPassword2 || !newPassword2 || '重复密码不正确']"
        @update:error="isNewPwdErr = $event"
        :append-icon="showNewPwd ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showNewPwd ? 'text' : 'password'"
        @click:append="showNewPwd = !showNewPwd"
        :counter="newPassword1.length"
      ></v-text-field>
    </v-row>
    <v-row align="center" justify="center">
      <v-btn
        large
        color="primary"
        :block="$vuetify.breakpoint.name === 'xs'"
        :disabled="!oldPassword || !newPassword1 || !newPassword2 || isNewPwdErr"
        @click="changePassword"
        >确定
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import axios from 'axios';

export default {
  name: 'ChangePassword',
  data: () => ({
    oldPassword: '',
    showOldPwd: false,
    newPassword1: '',
    showNewPwd: false,
    newPassword2: '',
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
    async changePassword() {
      try {
        const { oldPassword, newPassword1: newPassword } = this;
        const { status } = (await axios.patch('/user/password', { oldPassword, newPassword })) || {};
        if (status === 200) {
          this.showDialog({ value: 'ChangePasswordSuccess', style: 0, text: '修改密码成功 , 请重新登陆' });
          this.userLogin({ value: false });
        }
      } catch ({
        response: {
          status,
          data: { error },
        },
      }) {
        if (status === 404 && error === 'OldPasswordError') {
          this.showDialog({ value: 'ChangePasswordError', style: 1, text: '旧密码错误' });
        } else if (status === 500) {
          this.showDialog({ value: 'ServerError', style: 1, text: `服务器错误 , ${error.code}` });
        }
      }
      this.oldPassword = '';
      this.newPassword1 = '';
      this.newPassword2 = '';
    },
    ...mapMutations(['userLogin', 'showDialog']),
  },
};
</script>
