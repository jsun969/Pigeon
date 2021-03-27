<template>
  <v-main>
    <router-view />
    <v-bottom-navigation fixed :value="btmNav" color="primary" grow>
      <v-btn to="/">
          <span>发送信息</span>
          <v-icon>mdi-send</v-icon>
      </v-btn>
      <v-btn to="/history">
          <span>历史记录</span>
          <v-icon>mdi-history</v-icon>
      </v-btn>
      <v-btn to="/add">
          <span>添加设备</span>
          <v-icon>mdi-cellphone-link</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-main>
</template>

<script>
export default {
  name: 'Main',
  data: () => ({
    btmNav: 0,
  }),
};
</script>

<style lang="scss">
a {
  text-decoration: none;
}
</style>
