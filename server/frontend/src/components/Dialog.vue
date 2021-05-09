<template>
  <v-dialog v-model="showDialog" width="300" @click:outside="clickOutside">
    <v-card>
      <v-card-title
        :class="{ headline: true, success: titleStyle === 0, error: titleStyle === 1, warning: titleStyle === 2 }"
        style="color: white"
      >
        {{ ['成功', '失败', '警告'][titleStyle] }}
      </v-card-title>

      <v-card-text style="padding: 24px 20px;">{{ mainText }}</v-card-text>

      <v-divider></v-divider>

      <v-card-actions v-if="titleStyle === 2">
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="$emit('confirmClose')">
          是
        </v-btn>
        <v-btn color="primary" text @click="$emit('refuseClose')">
          否
        </v-btn>
      </v-card-actions>
      <v-card-actions v-else>
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
    titleStyle: Number,
    mainText: String,
  },
  methods: {
    clickOutside() {
      this.$emit(this.titleStyle === 2 ? 'refuseClose' : 'close');
    },
  },
};
</script>
