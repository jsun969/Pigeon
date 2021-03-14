<template>
  <v-app>
    <router-view />
    <v-bottom-navigation :value="value" color="primary">
      <router-link to="/">
        <v-btn>
          <span>Home</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
      </router-link>
      <router-link to="/about">
        <v-btn>
          <span>About</span>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </router-link>
      <v-btn>
        <span>Nearby</span>
        <v-icon>mdi-map-marker</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  name: 'Main',
};
</script>
