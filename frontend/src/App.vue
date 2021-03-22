<template>
  <v-app>
    <v-app-bar app color="primary" dark>飞鸽传书</v-app-bar>
    <v-main>
      <UserAuth v-if="isLogin" @register-success="regSuccess" />
      <Main v-else />
    </v-main>
    <Dialog :showDialog="true" />
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";
import UserAuth from './components/UserAuth';
import Main from './components/Main';
import Dialog from './components/Dialog';
export default {
  name: 'App',
  components: {
    // HelloWorld,
    UserAuth,
    Main,
    Dialog,
  },
  data: () => ({
    isLogin: true,
    dialog: false,
  }),
  methods: {
    regSuccess() {
      console.log('Login Success!!');
    },
  },
};
</script>
