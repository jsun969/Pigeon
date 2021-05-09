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
          <v-card-title>未读消息</v-card-title>
          <v-card-text>
            <span class="display-2">99</span>
            <span class="title">条</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>
          <v-card-title>空</v-card-title>
          <v-card-text>
            还不知道写点啥
            <v-btn color="pink" dark @click="testPopUp">
              TEST POPUP
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Status',
  computed: {
    ...mapState(['code']),
  },
  methods: {
    testPopUp() {
      const msg = '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试test114514???';
      const isChinesePunctuation = /[\u3002\uff1b\uff0c\uff1a\uff08\uff09\u3001\uff1f\u300a\u300b\u2014\uff01\u3010\u3011\u2026]/;
      const isChinese = /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/;
      let msgLength = 0;
      [...msg].forEach(letter => {
        msgLength += isChinese.test(letter) || isChinesePunctuation.test(letter) ? 100 : 50;
      });
      // 窗体长度可能会有一点离谱的小问题
      this.popUp({
        width: msgLength > 1000 ? 1000 : msgLength,
        height: 35 + Math.ceil(msgLength / 1000) * 150,
        from: '测试',
        message: msg,
      });
    },
    ...mapMutations(['popUp']),
  },
};
</script>
