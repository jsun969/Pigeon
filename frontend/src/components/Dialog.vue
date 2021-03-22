<template>
  <v-dialog v-model="showDialog" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2">{{ titleText }}</v-card-title>

      <v-card-text>{{ mainText }}</v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="showDialog = false">
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
