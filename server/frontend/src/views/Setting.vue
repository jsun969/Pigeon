<template>
  <div class="setting" style="margin-top:28px">
    <v-btn text color="primary" v-if="!showMenu" @click="backToMenu" style="position:fixed;top:67px;left:5px;">&lt;设置</v-btn>
    <div class="menu" v-if="showMenu">
      <v-list flat v-if="$vuetify.breakpoint.name === 'xs'">
        <div v-for="(item, i) in items" :key="i">
          <v-divider v-if="item.divider" :inset="item.inset"></v-divider>
          <v-list-item v-if="!item.divider" @click="handleClick(item.text)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
      <div v-if="$vuetify.breakpoint.name != 'xs'" style="display:flex;flex-wrap:wrap;">
        <div v-for="(item, i) in items.filter(item => item.icon)" :key="i" style="margin:16px;">
          <v-btn x-large @click="handleClick(item.text)" height="100">
            <div style="display:flex;flex-direction:column;">
              <v-icon>{{ item.icon }}</v-icon>
              <span>{{ item.text }}</span>
            </div>
          </v-btn>
        </div>
      </div>
    </div>
    <div class="password" v-else-if="showItem.password" style="padding:24px;">
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
            :block="$vuetify.breakpoint.name == 'xs'"
            :disabled="!oldPassword || !newPassword1 || !newPassword2 || isNewPwdErr"
            @click="changePassword"
            >确定
          </v-btn>
        </v-row>
      </v-container>
    </div>
    <div class="fullname" v-else-if="showItem.fullname" style="padding:24px;">
      <v-container>
        <v-row>
          <v-text-field
            v-model="newFullName"
            label="新姓名"
            outlined
            @update:error="isNewFullNameErr = $event"
            :rules="[...fullNameRules, newFullName !== userFullName || !newFullName || '与旧姓名相同']"
          ></v-text-field>
        </v-row>
        <v-row align="center" justify="center">
          <v-btn
            large
            color="primary"
            :block="$vuetify.breakpoint.name == 'xs'"
            :disabled="!newFullName || newFullNameErr"
            @click="changeFullName"
            >确定
          </v-btn>
        </v-row>
      </v-container>
    </div>
    <div class="message-style" v-else-if="showItem.messageStyle">
      <h1>消息样式</h1>
    </div>
    <div class="theme" v-else-if="showItem.theme">
      <h1>切换主题</h1>
    </div>
    <div class="about" v-else-if="showItem.about">
      <h1>关于项目</h1>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import axios from 'axios';

export default {
  name: 'Setting',
  data: () => ({
    items: [
      { divider: true, inset: false },
      { icon: 'mdi-information', text: '关于项目' },
      { divider: true, inset: true },
      { icon: 'mdi-form-textbox-password', text: '修改密码' },
      { divider: true, inset: true },
      { icon: 'mdi-badge-account-horizontal', text: '修改姓名' },
      { divider: true, inset: true },
      { icon: 'mdi-message-question', text: '消息样式' },
      { divider: true, inset: true },
      { icon: 'mdi-compare', text: '切换主题' },
      { divider: true, inset: true },
      { icon: 'mdi-logout', text: '退出登录' },
      { divider: true, inset: false },
    ],
    showMenu: true,
    showItem: {
      about: false,
      password: false,
      fullname: false,
      messageStyle: false,
      theme: false,
    },
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
    isNewPwdErr: false,
    newFullName: '',
    newFullNameErr: false,
    fullNameRules: [
      value => (value || '').length <= 20 || !value || '最多20个字符',
      value => (value || '').length >= 2 || !value || '至少2个字符',
      value => {
        // 支持中文名(包括少数民族)
        const pattern = /^[\u4E00-\u9FA5]+(·[\u4E00-\u9FA5]+)*$/;
        return pattern.test(value) || !value || '姓名无效';
      },
    ],
  }),
  methods: {
    handleClick(itemText) {
      if (itemText === '退出登录') {
        this.showDialog({ value: 'Logout', style: 2, text: '确定退出当前帐号?' });
      } else if (itemText === '修改密码') {
        this.showItem.password = true;
        this.showMenu = false;
      } else if (itemText === '修改姓名') {
        this.showItem.fullname = true;
        this.showMenu = false;
      } else if (itemText === '消息样式') {
        this.showItem.messageStyle = true;
        this.showMenu = false;
      } else if (itemText === '切换主题') {
        this.showItem.theme = true;
        this.showMenu = false;
      } else if (itemText === '关于项目') {
        this.showItem.about = true;
        this.showMenu = false;
      }
    },
    backToMenu() {
      this.showMenu = true;
      for (const key in this.showItem) {
        this.showItem[key] = false;
      }
      this.oldPassword = '';
      this.newPassword1 = '';
      this.newPassword2 = '';
      this.newFullName = '';
    },
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
    async changeFullName() {
      // 待做:确认是否修改姓名
      try {
        const { newFullName } = this;
        const { status } = (await axios.patch('/user/full-name', { newFullName })) || {};
        if (status === 200) {
          this.setNewFullNameWhenChange({ fullName: this.newFullName });
          this.showDialog({ value: 'ChangeFullNameSuccess', style: 0, text: '修改姓名成功' });
        }
      } catch ({
        response: {
          status,
          data: { error },
        },
      }) {
        if (status === 500) {
          this.showDialog({ value: 'ServerError', style: 1, text: `服务器错误 , ${error.code}` });
        }
      }
      this.newFullName = '';
    },
    ...mapMutations(['showDialog', 'userLogin', 'setNewFullNameWhenChange']),
  },
  computed: {
    ...mapState(['userFullName']),
  },
};
</script>
