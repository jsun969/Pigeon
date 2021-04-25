<template>
  <v-app>
    <v-system-bar window fixed color="primary" dark style="-webkit-app-region: drag">
      <span>飞鸽传书</span>
      <v-spacer></v-spacer>
      <v-icon style="-webkit-app-region: no-drag;" @click="minimize">mdi-minus</v-icon>
      <v-icon style="-webkit-app-region: no-drag;" @click="close">mdi-close</v-icon>
    </v-system-bar>
    <v-main style="margin-top:32px">
      <v-tabs grow v-model="tabs">
        <v-tab>软件设置</v-tab>
        <v-tab>历史记录</v-tab>
        <v-tab>已绑教师</v-tab>
      </v-tabs>
      <v-container>
        <v-tabs-items v-model="tabs">
          <v-tab-item>lol</v-tab-item>
          <v-tab-item>olo</v-tab-item>
          <v-tab-item>llooll</v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    tabs: 0,
  }),
  methods: {
    minimize() {
      console.log('minimize');
    },
    close() {
      console.log('close');
    },
  },
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}
</style>
