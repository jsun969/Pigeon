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
        <v-btn color="pink" text v-bind="attrs" @click="accept">
          同意
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'Users',
  data: () => ({
    users: [
      'Gerald Higgins',
      'Marion Hampton',
      'Katie Thomas',
      'Craig Taylor',
      'Sam Guzman',
      'Ricky Oliver',
      'Ida Diaz',
      'Tommy Adams',
      'Benjamin Chavez',
      'Isabel Sanchez',
      'Alma Miles',
    ],
    snackbar: false,
    newUser: 'Caroline Davis',
    lastTimes: 30,
    timer: null,
  }),
  sockets: {
    askDeviceAdd({ fullName }) {
      this.newUser = fullName;
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
      this.users.push(this.newUser);
    },
  },
};
</script>
