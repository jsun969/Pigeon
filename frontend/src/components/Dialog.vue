<template>
  <v-dialog v-model="showDialog" width="300">
    <v-card>
      <v-card-title :class="{ headline: true, success: titleStyle, error: !titleStyle }" style="color: white">
        {{ titleStyle ? '成功' : '失败' }}
      </v-card-title>

      <v-card-text style="padding: 24px 20px;">{{ mainText }}</v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="$emit('close')">
          确定
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    showDialog: Boolean,
    titleStyle: Boolean,
    titleText: String,
    mainText: String,
  },
};
</script>
