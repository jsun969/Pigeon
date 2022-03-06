<template>
  <v-container>
    <v-chip
      v-for="(item, index) in users.map(({ fullName }) => fullName)"
      :key="index"
      close
      class="ma-2"
      @click:close="confirmRemove(index)"
    >
      {{ item }}
    </v-chip>

    <v-dialog v-model="showDialog" width="300">
      <v-card>
        <v-card-title class="headline warning white--text">警告</v-card-title>
        <v-card-text class="py-6 px-5">确认删除{{ removingUserName }}老师</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="remove(removingUserIndex)">
            是
          </v-btn>
          <v-btn text @click="showDialog = false">
            否
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Users',
  data: () => ({
    showDialog: false,
    removingUserName: null,
    removingUserIndex: null,
  }),
  methods: {
    confirmRemove(index) {
      this.removingUserIndex = index;
      this.removingUserName = this.users[index].fullName;
      this.showDialog = true;
    },
    remove(index) {
      this.showDialog = false;
      this.$socket.client.emit('removeUser', { name: this.users[index].username, code: this.code });
      this.removeUser({ index });
    },
    ...mapMutations(['changeMessageFullName', 'removeUser']),
  },
  computed: {
    ...mapState(['code', 'users']),
  },
};
</script>
