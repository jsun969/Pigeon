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
      <div v-if="$vuetify.breakpoint.name !== 'xs'" style="display:flex;flex-wrap:wrap;">
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
      <ChangePassword />
    </div>
    <div class="fullname" v-else-if="showItem.fullname" style="padding:24px;">
      <ChangeFullName />
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
import ChangeFullName from '../components/ChangeFullName';
import ChangePassword from '../components/ChangePassword';

export default {
  name: 'Setting',
  components: {
    ChangeFullName,
    ChangePassword,
  },
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
  },
};
</script>
