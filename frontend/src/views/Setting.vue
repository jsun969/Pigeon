<template>
  <div class="setting" style="margin-top:30px">
    <v-btn text color="primary" v-if="!showMenu" @click="showMenu = true" style="position:fixed;top:67px;left:5px;">&lt;设置</v-btn>
    <div class="menu" v-if="showMenu">
      <v-list flat>
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
    </div>
    <div class="password" v-else-if="showPassword">
      <h1>修改密码</h1>
    </div>
    <div class="fullname" v-else-if="showFullname">
      <h1>修改姓名</h1>
    </div>
    <div class="message-style" v-else-if="showMessageStyle">
      <h1>消息样式</h1>
    </div>
    <div class="theme" v-else-if="showTheme">
      <h1>切换主题</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  data: () => ({
    items: [
      { divider: true, inset: false },
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
    showPassword: false,
    showFullname: false,
    showMessageStyle: false,
    showTheme: false,
  }),
  methods: {
    handleClick(itemText) {
      if (itemText === '退出登录') {
        this.$store.state.dialog.open = true;
        this.$store.state.dialog.value = 'logout';
        this.$store.state.dialog.style = 2;
        this.$store.state.dialog.text = '确定退出当前帐号?';
      } else if (itemText === '修改密码') {
        this.showPassword = true;
        this.showMenu = false;
      } else if (itemText === '修改姓名') {
        this.showFullname = true;
        this.showMenu = false;
      } else if (itemText === '消息样式') {
        this.showMessageStyle = true;
        this.showMenu = false;
      } else if (itemText === '切换主题') {
        this.showTheme = true;
        this.showMenu = false;
      }
    },
  },
};
</script>
