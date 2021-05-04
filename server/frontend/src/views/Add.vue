<template>
  <div class="add">
    <div id="mobile" v-if="$vuetify.breakpoint.name == 'xs'">
      <v-container>
        <v-row class="mt-2 mb-n9">
          <v-col>
            <v-text-field
              v-model="newCode"
              label="设备代码"
              :rules="[...codeRules, !devices.map(({ code }) => code).includes(newCode) || !newCode || '设备已添加']"
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
        <v-row class="px-2">
          <v-col>
            <v-btn block large color="primary" :disabled="isAddingErr || !newName || !newCode" @click="add()">添加</v-btn>
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
                <v-btn
                  icon
                  color="green"
                  :disabled="item.status === 2"
                  v-if="!item.editing"
                  @click="startEditingDevice({ index })"
                >
                  <v-icon>mdi-playlist-edit</v-icon>
                </v-btn>
                <v-btn icon color="red" :disabled="item.status === 2" v-if="!item.editing" @click="remove(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon color="red" v-if="item.editing" @click="stopEditingDevice({ index })">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
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

    <div id="PC" v-else class="ma-6 d-flex flex-wrap">
      <v-card height="320" width="350" class="ma-5 px-6" outlined>
        <v-card-title class="display-1 mt-3"><v-spacer></v-spacer>添加设备<v-spacer></v-spacer></v-card-title>
        <v-text-field
          v-model="newCode"
          label="设备代码"
          :rules="[...codeRules, !devices.map(({ code }) => code).includes(newCode) || !newCode || '设备已添加']"
          @update:error="isAddingErr = $event"
        ></v-text-field>
        <v-text-field
          v-model="newName"
          label="备注名"
          :rules="[!devices.map(({ name }) => name).includes(newName) || !newName || '备注名重复']"
          @update:error="isAddingErr = $event"
          class="mb-2"
        ></v-text-field>
        <v-btn block large color="primary" :disabled="isAddingErr || !newName || !newCode" @click="add()">确定</v-btn>
      </v-card>
      <v-card width="350" hover v-for="(item, index) in devices" :key="index" class="ma-5" :loading="item.status === 2">
        <v-card-title>
          <v-spacer></v-spacer>
          <div id="editing-name" v-if="item.editing" class="d-flex">
            <v-text-field
              v-model="item.editingName"
              outlined
              placeholder="新备注"
              class="mr-2"
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
            <div id="editing-name-operation" class="d-flex flex-column">
              <v-btn
                :dark="!(isEditingError || item.editingName === item.name)"
                small
                color="green"
                @click="confirmEdit(item, index)"
                :disabled="isEditingError || item.editingName === item.name"
                class="mb-1"
              >
                确定
              </v-btn>
              <v-btn dark small color="red" @click="stopEditingDevice({ index })">
                取消
              </v-btn>
            </div>
          </div>
          <span v-else>{{ item.name }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-subtitle class="text-center"> 设备代码 : {{ item.code }} </v-card-subtitle>
        <v-card-text class="d-flex flex-column text-center">
          <v-icon size="128">mdi-laptop</v-icon>
          <span :class="['green--text', 'red--text', 'gray--text'][item.status]">
            <v-icon :color="['green', 'red', 'gray'][item.status]">mdi-circle-medium</v-icon>
            {{ ['在线', '离线', '未知'][item.status] }}
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="cyan" dark class="mx-2 mb-4" @click="startEditingDevice({ index })">
            <v-icon left>mdi-playlist-edit</v-icon>修改备注
          </v-btn>
          <v-btn color="red" dark class="mx-2 mb-4" @click="remove(item)"> <v-icon left>mdi-delete</v-icon>删除设备 </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import axios from 'axios';

export default {
  name: 'Add',
  data: () => ({
    newCode: null,
    newName: '',
    isAddingErr: false,
    codeRules: [
      value => (value || '').length <= 6 || !value || '最多6个字符',
      value => (value || '').length >= 6 || !value || '至少6个字符',
      value => {
        const pattern = /^\d{1,}$/;
        return pattern.test(value) || !value || '应为纯数字';
      },
    ],
    isEditingError: false,
    timeoutTimer: null,
  }),
  sockets: {
    askDeviceRes({ result, code }) {
      if (result) {
        clearTimeout(this.timeoutTimer);
        this.setDeviceStatus({ code, status: 0 });
      } else {
        clearTimeout(this.timeoutTimer);
        this.removeDevice({ code });
      }
    },
    deviceOnline({ code }) {
      this.setDeviceStatus({ code, status: 0 });
    },
    deviceOffline({ code }) {
      this.setDeviceStatus({ code, status: 1 });
    },
    removeUserHotUpdate({ code }) {
      this.removeDevice({ code });
    },
  },
  methods: {
    async confirmEdit(item, index) {
      this.setDeviceName({ index, newName: item.editingName });
      this.stopEditingDevice({ index });
      try {
        const { status } =
          (await axios.patch('/device/remarkName', { code: this.devices[index].code, name: item.editingName })) || {};
        if (status === 200) {
          console.log('change succeed');
        }
      } catch {
        return;
      }
    },
    add() {
      this.addDevice({ code: this.newCode, name: this.newName });
      this.$socket.client.emit('addDevice', {
        auth: localStorage.getItem('userToken'),
        code: this.newCode,
        remarkName: this.newName,
      });
      const newCodeTmp = this.newCode;
      this.newCode = '';
      this.newName = '';
      // 设备状态超时则删除
      this.timeoutTimer = setTimeout(() => {
        if (this.devices.find(({ code }) => code === newCodeTmp).status === 2) {
          this.removeDevice({ code: newCodeTmp });
        }
      }, 31000);
    },
    remove({ code }) {
      this.showDialog({ value: { name: 'removeDevice', code }, style: 2, text: '确认删除设备?' });
    },
    ...mapMutations([
      'setDeviceName',
      'startEditingDevice',
      'stopEditingDevice',
      'addDevice',
      'showDialog',
      'removeDevice',
      'setDeviceStatus',
    ]),
  },
  computed: {
    ...mapState(['devices']),
  },
};
</script>
