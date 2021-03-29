<template>
  <v-main>
    <router-view />
    <v-bottom-navigation fixed v-model="btmNav" color="primary" grow>
      <v-btn v-for="(item, i) in navItems" :key="i" :to="item.to" :value="item.value">
        <span>{{ item.text }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-main>
</template>

<script>
export default {
  name: 'Main',
  data: () => ({
    navItems: [
      { to: '/', text: '发送信息', icon: 'mdi-email-send', value: 'Home' },
      { to: '/history', text: '历史记录', icon: 'mdi-history', value: 'History' },
      { to: '/add', text: '添加设备', icon: 'mdi-cellphone-link', value: 'Add' },
      { to: '/setting', text: '个人设置', icon: 'mdi-account-cog', value: 'Setting' },
    ],
  }),
  computed: {
    btmNav() {
      return this.$route.name;
    },
  },
};
</script>
