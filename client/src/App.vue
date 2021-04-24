<template>
  <div id="app">
    <nav id="top-nav">
      <router-link v-for="(item, index) in navigation" :key="index" :to="item.to">{{ item.name }}</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  data: () => ({
    navigation: [
      { name: '设置', to: '/' },
      { name: '历史', to: '/about' },
      { name: '用户', to: '/about' },
    ],
  }),
};
</script>

<style lang="scss">
#top-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
