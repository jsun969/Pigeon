<template>
  <v-app>
    <v-app-bar color="primary" dark flat fixed style="-webkit-app-region: drag">
      <v-toolbar-title>飞鸽传书</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon style="-webkit-app-region: no-drag;" @click="github">
        <v-icon>mdi-github</v-icon>
      </v-btn>
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
          <v-tab>绑定教师</v-tab>
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
import { remote, shell } from 'electron';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'App',
  components: {
    Status,
    History,
    Users,
  },
  mounted() {
    this.getCodeAndMessages();
  },
  beforeDestroy() {
    this.$socket.client.emit('deviceDestroy', { code: this.code });
  },
  data: () => ({
    tabs: 0,
  }),
  sockets: {
    connect() {
      this.$socket.client.emit('deviceCreated', { code: this.code });
    },
    sendMessageToDevice({ message, from, id, username }) {
      const isChinesePunctuation = /[\u3002\uff1b\uff0c\uff1a\uff08\uff09\u3001\uff1f\u300a\u300b\u2014\uff01\u3010\u3011\u2026]/;
      const isChinese = /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/;
      let msgLength = 0;
      [...message].forEach(letter => {
        msgLength += isChinese.test(letter) || isChinesePunctuation.test(letter) ? 100 : 50;
      });
      // 窗体长度可能会有一点离谱的小问题
      this.popUp({
        width: msgLength > 1000 ? 1000 : msgLength,
        height: 35 + Math.ceil(msgLength / 1000) * 150,
        from,
        username,
        message,
        id,
      });
    },
  },
  methods: {
    minimize() {
      remote.getCurrentWindow().minimize();
    },
    close() {
      remote.getCurrentWindow().hide();
    },
    github() {
      shell.openExternal('https://github.com/jsun969/Pigeon');
    },
    ...mapActions(['getCodeAndMessages']),
    ...mapMutations(['popUp']),
  },
  computed: { ...mapState(['code', 'messages']) },
};
</script>

<style lang="scss">
* {
  user-select: none;
}
::-webkit-scrollbar {
  display: none;
}
</style>
