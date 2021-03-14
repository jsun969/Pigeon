<template>
  <v-app>
    <v-app-bar app color="primary" dark>飞鸽传书</v-app-bar>
    <v-main>
      <UserAuth v-if="isLogin" />
      <Main v-else />
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";
import UserAuth from './components/UserAuth';
import Main from './components/Main';
export default {
  name: 'App',
  components: {
    // HelloWorld,
    UserAuth,
    Main,
  },
  data: () => ({
    isLogin: false,
  }),
};
</script>
