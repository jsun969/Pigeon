<template>
  <v-container>
    <div v-for="(item, index) in messagesRev" :key="index" class="ma-3">
      <v-lazy
        v-model="item.isActive"
        :options="{
          threshold: 0.5,
        }"
        min-height="100"
        transition="fade-transition"
      >
        <v-card hover>
          <v-card-title>
            <span>{{ item.fullName }}老师</span>
            <v-spacer></v-spacer>
            <span class="subtitle-2">{{ formattedTime(item.time) }}</span>
          </v-card-title>
          <v-card-text>{{ item.message }}</v-card-text>
        </v-card>
      </v-lazy>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'History',
  methods: {
    formattedTime(timeTmp) {
      const baseTime = new Date(timeTmp);
      const day = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][baseTime.getDay()];
      const date = `${baseTime.getMonth() + 1}.${baseTime.getDate()}`;
      const time = `${baseTime
        .getHours()
        .toString()
        .padStart(2, '0')}:${baseTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${baseTime
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
      return `${day} ${date} ${time}`;
    },
  },
  computed: {
    ...mapGetters(['messagesRev']),
  },
};
</script>
