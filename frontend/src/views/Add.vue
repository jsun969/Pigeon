<template>
  <div class="add">
    <v-container>
      <v-row style="margin-bottom:-32px">
        <v-col>
          <v-text-field label="设备代码"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field label="备注名"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn block large color="primary">添加</v-btn>
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
              <v-text-field v-model="item.editingName"></v-text-field>
            </td>
            <td>
              <v-btn icon color="green" :disabled="item.status === 2" v-if="!item.editing" @click="startEditing({ index })">
                <v-icon>mdi-playlist-edit</v-icon>
              </v-btn>
              <v-btn icon color="red" :disabled="item.status === 2" v-if="!item.editing"><v-icon>mdi-delete</v-icon></v-btn>
              <v-btn icon color="red" v-if="item.editing" @click="stopEditing({ index })"><v-icon>mdi-close</v-icon></v-btn>
              <v-btn icon color="green" v-if="item.editing" @click="confirmEdit(item, index)"><v-icon>mdi-check</v-icon></v-btn>
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
  methods: {
    confirmEdit(item, index) {
      this.setDeviceName({ index, newName: item.editingName });
      this.stopEditing({ index });
      //缺少:后端请求代码
    },
    ...mapMutations(['setDeviceName', 'startEditing', 'stopEditing']),
  },
  computed: {
    ...mapState(['devices']),
  },
};
</script>
