<template>
  <v-main>
    <router-view />
    <v-bottom-navigation fixed :value="btmNav" color="primary" grow>
      <v-btn to="/">
          <span>Home</span>
          <v-icon>mdi-history</v-icon>
      </v-btn>
      <v-btn to="/about">
          <span>About</span>
          <v-icon>mdi-heart</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-main>
</template>

<script>
export default {
  name: 'Main',
  data: () => ({
    btmNav: 0,
  }),
};
</script>

<style lang="scss">
a {
  text-decoration: none;
}
</style>
