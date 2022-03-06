<template>
  <v-container>
    <v-row align="center" justify="center" class="mx-4 mt-16">
      <div style="width:80vw">
        <v-autocomplete
          chips
          deletable-chips
          v-model="selectDevices"
          :items="devices.filter(({ status }) => status === 0).map(({ name }) => name)"
          label="班级"
          no-data-text="无符合班级"
          multiple
        ></v-autocomplete>
        <v-textarea outlined no-resize rows="5" label="信息" v-model="message" counter="100"></v-textarea>
        <v-btn
          color="primary"
          elevation="2"
          large
          :block="$vuetify.breakpoint.name === 'xs'"
          :disabled="message.length > 100 || message === '' || selectDevices.length === 0"
          @click="sendMessage"
          >发送</v-btn
        >
      </div>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Home',
  data: () => ({
    selectDevices: [],
    message: '',
  }),
  methods: {
    sendMessage() {
      const selectDevicesCodes = this.devices
        .filter(({ name }) => this.selectDevices.some(item => item === name))
        .map(({ code }) => code);
      const messageTmp = this.message;
      this.$socket.client.emit(
        'sendMessage',
        {
          auth: localStorage.getItem('userToken'),
          codes: selectDevicesCodes,
          message: messageTmp,
        },
        databaseData => {
          this.addMessageToHistory({ ...databaseData, devices: selectDevicesCodes, message: messageTmp, status: true });
        }
      );
      this.message = '';
      this.showDialog({ value: 'SendSuccess', style: 0, text: '发送成功' });
    },
    ...mapMutations(['showDialog', 'addMessageToHistory']),
  },
  computed: {
    ...mapState(['devices']),
  },
};
</script>
