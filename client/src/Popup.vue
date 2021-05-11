<template>
  <v-app>
    <v-system-bar window style="-webkit-app-region: drag" color="primary" dark fixed>
      <v-icon>mdi-message</v-icon>
      <span>来自{{ popUp.from }}老师的消息</span>
      <v-spacer></v-spacer>
      <v-icon style="-webkit-app-region: no-drag;" @click="close">mdi-close</v-icon>
    </v-system-bar>
    <v-main>
      <div class="mt-4">
        <span id="message">
          {{ popUp.message }}
        </span>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import { remote, ipcRenderer } from 'electron';

export default {
  name: 'Popup',
  data: () => ({
    databaseID: null,
  }),
  mounted() {
    this.databaseID = ipcRenderer.sendSync('getDatabaseID');
  },
  methods: {
    close() {
      this.$socket.client.emit('messageClosed', { id: this.databaseID });
      remote.getCurrentWindow().close();
    },
  },
  computed: {
    ...mapState(['popUp']),
  },
};
</script>

<style lang="scss">
* {
  user-select: none;
}
::-webkit-scrollbar {
  display: none;
}
@font-face {
  font-family: 'Sarasa Mono SC';
  src: url('./assets/sarasa-mono-sc-regular.ttf') format('truetype');
}
#message {
  font-family: 'Sarasa Mono SC' !important;
  font-size: 100px;
}
</style>
