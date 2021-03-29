<template>
  <div class="setting">
    <div class="menu">
      <v-list flat width="100vw">
        <div v-for="(item, i) in items" :key="i">
          <v-divider v-if="item.divider" :inset="item.inset"></v-divider>
          <v-list-item v-if="!item.divider" @click="handleClick(item.click)">
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
    <!-- <div class="change-password">
      <h1>lol</h1>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'Setting',
  data: () => ({
    items: [
      { divider: true, inset: false },
      { icon: 'mdi-form-textbox-password', text: '修改密码', click: '' },
      { divider: true, inset: true },
      { icon: 'mdi-badge-account-horizontal', text: '修改姓名', click: '' },
      { divider: true, inset: true },
      { icon: 'mdi-message-question', text: '消息样式', click: '' },
      { divider: true, inset: true },
      { icon: 'mdi-logout', text: '退出登录', click: 'logout' },
      { divider: true, inset: false },
    ],
  }),
  methods: {
    logout() {
      console.log('lol');
      localStorage.removeItem('userToken');
      this.$store.state.isLogin = false;
      this.$router.push({ path: '/' });
    },
    handleClick(clickMethod) {
      eval(`this.${clickMethod}()`)
    },
  },
};
</script>
