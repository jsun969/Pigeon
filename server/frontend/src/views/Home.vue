<template>
  <v-container>
    <v-row align="center" justify="center" style="margin-top:8vh">
      <div style="width:80vw">
        <v-autocomplete
          chips
          deletable-chips
          v-model="selectDevice"
          :items="devices.filter(({ status }) => status === 0).map(({ name }) => name)"
          label="班级"
          no-data-text="无符合班级"
          multiple
        ></v-autocomplete>
        <v-textarea outlined no-resize rows="5" label="信息" v-model="msg" counter="100"></v-textarea>
        <v-btn
          color="primary"
          elevation="2"
          large
          :block="$vuetify.breakpoint.name === 'xs'"
          :disabled="msg.length > 100 || msg === '' || selectDevice === []"
          >发送</v-btn
        >
      </div>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Home',
  data: () => ({
    selectDevice: [],
    msg: '',
  }),
  computed: {
    ...mapState(['devices']),
  },
};
</script>
