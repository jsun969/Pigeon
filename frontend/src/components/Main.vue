<template>
  <v-main>
    <router-view />
    <v-bottom-navigation fixed :value="btmNav" color="primary" grow>
      <v-btn v-for="(item, i) in navItems" :key="i" :to="item.to">
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
    btmNav: 0,
    navItems: [
      { to: '/', text: '发送信息', icon: 'mdi-email-send' },
      { to: '/history', text: '历史记录', icon: 'mdi-history' },
      { to: '/add', text: '添加设备', icon: 'mdi-cellphone-link' },
      { to: '/setting', text: '个人设置', icon: 'mdi-account-cog' },
    ],
  }),
};
</script>

<style lang="scss">
a {
  text-decoration: none;
}
</style>
