<template>
  <v-container>
    <div v-for="(item, index) in messagesRev" :key="index" class="ma-4">
      <v-lazy
        v-model="item.isActive"
        :options="{
          threshold: 0.5,
        }"
        min-height="100"
        transition="fade-transition"
      >
        <v-card elevation="4">
          <v-card-title> 发送至{{ item.devicesRemark.toString() }} </v-card-title>
          <v-card-text class="d-flex flex-column">
            <span>{{ item.message }}</span>
            <div class="d-flex justify-space-between mt-4">
              <span :class="item.status ? 'green--text' : 'gray--text'">
                <v-icon :color="item.status ? 'green' : 'gray'">mdi-circle-medium</v-icon>
                {{ item.status ? '显示中' : '已关闭' }}
              </span>
              <span>{{ formattedTime(item.time) }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-lazy>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'History',
  computed: {
    ...mapGetters(['messagesRev']),
  },
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
};
</script>
