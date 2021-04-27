<template>
  <v-app>
    <v-app-bar color="primary" dark flat fixed style="-webkit-app-region: drag">
      <v-toolbar-title>飞鸽传书</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon style="-webkit-app-region: no-drag;" @click="minimize">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-btn icon style="-webkit-app-region: no-drag;" @click="close">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-tabs grow v-model="tabs" style="-webkit-app-region: no-drag;">
          <v-tab>软件状态</v-tab>
          <v-tab>历史记录</v-tab>
          <v-tab>已绑教师</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main style="margin-top:104px">
      <v-tabs-items v-model="tabs">
        <v-tab-item><Status /></v-tab-item>
        <v-tab-item><History /></v-tab-item>
        <v-tab-item><Users /></v-tab-item>
      </v-tabs-items>
    </v-main>
  </v-app>
</template>

<script>
import Status from './components/Status.vue';
import History from './components/History.vue';
import Users from './components/Users.vue';
import { remote } from 'electron';

export default {
  name: 'App',
  components: {
    Status,
    History,
    Users,
  },
  data: () => ({
    tabs: 0,
  }),
  methods: {
    minimize() {
      console.log('minimize');
      remote.getCurrentWindow().minimize();
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
