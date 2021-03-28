<template>
  <div class="setting">
    <v-list flat width="100vw">
      <div v-for="(item, i) in items" :key="i" :to="item.to">
        <v-divider v-if="item.divider" :inset="item.inset"></v-divider>
        <v-list-item v-if="!item.divider">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  data: () => ({
    items: [
      { divider: true, inset: false },
      { icon: 'mdi-form-textbox-password', text: '修改密码', to: '/add' },
      { divider: true, inset: true },
      { icon: 'mdi-badge-account-horizontal', text: '修改姓名', to: '/add' },
      { divider: true, inset: true },
      { icon: 'mdi-message-question', text: '消息样式', to: '/add' },
      { divider: true, inset: false },
    ],
  }),
};
</script>
