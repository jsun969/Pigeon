<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center" class="d-flex flex-column">
      <div style="width:80vw">
        <v-autocomplete
          chips
          deletable-chips
          v-model="selectDevice"
          :items="onlineDevicesName"
          label="班级"
          no-data-text="无符合班级"
          multiple
        ></v-autocomplete>
        <v-textarea outlined no-resize rows="5" name="input-7-4" label="信息" v-model="mainText"></v-textarea>
        <v-btn color="primary" elevation="2" large :block="$vuetify.breakpoint.name == 'xs'">发送</v-btn>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  data: () => ({
    selectDevice: [],
    mainText: '',
  }),
  computed: {
    ...mapGetters(['onlineDevicesName']),
  },
};
</script>
