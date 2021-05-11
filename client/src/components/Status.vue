<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>设备代码</v-card-title>
          <v-card-text class="display-4">
            {{ code }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn rounded outlined text> 刷新 <v-icon dark> mdi-reload </v-icon> </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title>累计消息</v-card-title>
          <v-card-text>
            <span class="display-2">{{ messagesCnt }}</span>
            <span class="title">条</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>
          <v-card-title>空</v-card-title>
          <v-card-text>
            还不知道写点啥
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Status',
  computed: {
    ...mapState(['code']),
    ...mapGetters(['messagesCnt']),
  },
};
</script>
