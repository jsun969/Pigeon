<template>
  <v-container>
    <v-chip v-for="(item, index) in users" :key="index" close style="margin:8px" @click:close="remove(index)">
      {{ item }}
    </v-chip>
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
    newRemarkName: null,
    lastTimes: 30,
    timer: null,
  }),
  sockets: {
    deviceAddReq({ fullName, remarkName, auth }) {
      this.newUser = fullName;
      this.newUserAuth = auth;
      this.newRemarkName = remarkName;
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
  },
  methods: {
    remove(index) {
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
      this.users.push(this.newUser);
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
