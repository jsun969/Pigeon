<template>
  <div class="home">
    <v-autocomplete chips v-model="selectClass" :items="totClass" label="班级" no-data-text="无符合班级" multiple style="width:80vw"></v-autocomplete>
    <v-textarea outlined no-resize rows="5" name="input-7-4" label="信息" style="width:80vw" v-model="mainText"></v-textarea>
    <v-btn color="primary" elevation="2" large :class="{ 'small-end': $vuetify.breakpoint.name !== 'xs' }">发送</v-btn>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    selectClass: ['高一5班', '初三16班'],
    totClass: ['高一5班', '初三16班', '初二24班', '高二8班', '高三20班', '初一15班', '初二75班', '高二97班', '高三19班', '初一97班'],
    mainText: '',
  }),
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  .small-end {
    align-self: flex-end;
  }
}
</style>
