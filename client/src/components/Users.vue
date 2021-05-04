<template>
  <v-container>
    <v-chip
      v-for="(item, index) in users.map(({ fullName }) => fullName)"
      :key="index"
      close
      style="margin:8px"
      @click:close="confirmRemove(index)"
    >
      {{ item }}
    </v-chip>

    <v-dialog v-model="showDialog" width="300">
      <v-card>
        <v-card-title class="headline warning" style="color: white">警告</v-card-title>
        <v-card-text style="padding: 24px 20px;">确认删除{{ removingUserName }}老师</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="remove(removingUserIndex)">
            是
          </v-btn>
          <v-btn text @click="showDialog = false">
            否
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" timeout="30000">
      <v-progress-circular rotate="-90" :value="(lastTimes * 100) / 30" color="white">
        {{ lastTimes }}
      </v-progress-circular>
      {{ newUser }}老师请求绑定此设备
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="refuse">
          拒绝
        </v-btn>
        <v-btn color="pink" text v-bind="attrs" @click="accept">
          同意
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  name: 'Users',
  async mounted() {
    try {
      const { status, data } = (await axios.get('/device/users', { params: { code: this.code } })) || {};
      if (status === 200) {
        this.users = data;
      }
    } catch (error) {
      return;
    }
  },
  data: () => ({
    users: [],
    snackbar: false,
    newUser: null,
    newUserAuth: null,
    newUserName: null,
    newRemarkName: null,
    lastTimes: 30,
    timer: null,
    showDialog: false,
    removingUserName: null,
    removingUserIndex: null,
  }),
  sockets: {
    deviceAddReq({ fullName, remarkName, auth, username }) {
      this.newUser = fullName;
      this.newUserAuth = auth;
      this.newRemarkName = remarkName;
      this.newUserName = username;
      this.snackbar = true;
      this.lastTimes = 30;
      const countdown = () => {
        this.timer = setTimeout(() => {
          if (this.lastTimes > 0) {
            this.lastTimes--;
            countdown();
          } else {
            clearTimeout(this.timer);
          }
        }, 1000);
      };
      countdown();
    },
    removeDeviceHotUpdate({ name }) {
      this.users.splice(
        this.users.findIndex(({ username }) => username === name),
        1
      );
    },
  },
  methods: {
    confirmRemove(index) {
      this.removingUserIndex = index;
      this.removingUserName = this.users[index].fullName;
      this.showDialog = true;
    },
    remove(index) {
      this.showDialog = false;
      this.$socket.client.emit('removeUser', { name: this.users[index].username, code: this.code });
      this.users.splice(index, 1);
    },
    accept() {
      clearTimeout(this.timer);
      this.snackbar = false;
      this.$socket.client.emit('allowAddDevice', {
        result: true,
        code: this.code,
        remarkName: this.newRemarkName,
        userAuth: this.newUserAuth,
      });
      this.users.push({ fullName: this.newUser, username: this.newUserName });
    },
    refuse() {
      clearTimeout(this.timer);
      this.snackbar = false;
      this.$socket.client.emit('allowAddDevice', {
        result: false,
        code: this.code,
        remarkName: this.newRemarkName,
        userAuth: this.newUserAuth,
      });
    },
  },
  computed: {
    ...mapState(['code']),
  },
};
</script>
