<template>
  <div class="add">
    <v-container>
      <v-row style="margin:4px 0px -36px">
        <v-col>
          <v-text-field
            v-model="newCode"
            label="设备代码"
            :rules="[...codeRules, !devices.map(({ code }) => code).includes(+newCode) || !newCode || '设备已添加']"
            @update:error="isAddingErr = $event"
            outlined
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="newName"
            label="备注名"
            :rules="[!devices.map(({ name }) => name).includes(newName) || !newName || '备注名重复']"
            @update:error="isAddingErr = $event"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row style="padding:0px 8px 0px 8px">
        <v-col>
          <v-btn block large color="primary" :disabled="isAddingErr || !newName || !newCode" @click="addNewDevice()"
            >添加</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
    <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">状态</th>
            <th class="text-left">代码</th>
            <th class="text-left">备注</th>
            <th class="text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in devices" :key="index">
            <td :style="{ color: ['green', 'red', 'gray'][item.status] }">{{ ['在线', '离线', '未知'][item.status] }}</td>
            <td>{{ item.code }}</td>
            <td v-if="!item.editing">{{ item.name }}</td>
            <td v-if="item.editing" style="width:130px">
              <v-text-field
                v-model="item.editingName"
                :rules="[
                  !devices
                    .map(({ name }) => name)
                    .filter(val => val !== item.name)
                    .includes(item.editingName) ||
                    !item.editingName ||
                    '备注名重复',
                  !!item.editingName || '请输入备注',
                ]"
                @update:error="isEditingError = $event"
              ></v-text-field>
            </td>
            <td>
              <v-btn icon color="green" :disabled="item.status === 2" v-if="!item.editing" @click="startEditing({ index })">
                <v-icon>mdi-playlist-edit</v-icon>
              </v-btn>
              <v-btn icon color="red" :disabled="item.status === 2" v-if="!item.editing"><v-icon>mdi-delete</v-icon></v-btn>
              <v-btn icon color="red" v-if="item.editing" @click="stopEditing({ index })"><v-icon>mdi-close</v-icon></v-btn>
              <v-btn
                icon
                color="green"
                v-if="item.editing"
                @click="confirmEdit(item, index)"
                :disabled="isEditingError || item.editingName === item.name"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Add',
  data: () => ({
    newCode: '',
    newName: '',
    isAddingErr: false,
    codeRules: [
      value => (value || '').length <= 6 || !value || '最多6个字符',
      value => (value || '').length >= 6 || !value || '至少6个字符',
      value => {
        const pattern = /^\d{1,}$/;
        return pattern.test(value) || !value || '设备代码应为纯数字';
      },
    ],
    isEditingError: false,
  }),
  methods: {
    confirmEdit(item, index) {
      this.setDeviceName({ index, newName: item.editingName });
      this.stopEditing({ index });
      //缺少:后端请求代码
    },
    addNewDevice() {
      this.addDevice({ code: +this.newCode, name: this.newName });
      this.$socket.client.emit('addDevice', { auth: localStorage.getItem('userToken'), code: +this.newCode });
      this.newCode = '';
      this.newName = '';
    },
    ...mapMutations(['setDeviceName', 'startEditing', 'stopEditing', 'addDevice']),
  },
  computed: {
    ...mapState(['devices']),
  },
};
</script>
