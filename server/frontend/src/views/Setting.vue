<template>
  <div>
    <v-tabs v-model="tabs" vertical v-if="$vuetify.breakpoint.name !== 'xs'">
      <v-tab v-for="(item, index) in settings.tabItems" :key="index">
        <v-icon left>
          {{ item.icon }}
        </v-icon>
        {{ item.text }}
      </v-tab>
      <v-tab-item class="ma-6">
        关于项目
      </v-tab-item>
      <v-tab-item class="ma-6">
        <ChangePassword />
      </v-tab-item>
      <v-tab-item class="ma-6">
        <ChangeFullName />
      </v-tab-item>
    </v-tabs>
    <v-tabs-items v-model="tabs" v-else>
      <v-tab-item class="ma-6">
        关于项目
      </v-tab-item>
      <v-tab-item class="ma-6">
        <ChangePassword />
      </v-tab-item>
      <v-tab-item class="ma-6">
        <ChangeFullName />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ChangeFullName from '../components/ChangeFullName';
import ChangePassword from '../components/ChangePassword';

export default {
  name: 'Setting',
  components: {
    ChangeFullName,
    ChangePassword,
  },
  methods: {
    ...mapMutations(['updateSettingsTabs']),
  },
  computed: {
    tabs: {
      get() {
        return this.settings.tabs;
      },
      set(value) {
        this.updateSettingsTabs(value);
      },
    },
    ...mapState(['settings']),
  },
};
</script>
