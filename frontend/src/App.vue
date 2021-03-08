<template>
  <v-app>
    <v-app-bar app color="primary" dark>飞鸽传书</v-app-bar>
    <v-main>
      <UserAuth />
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from "./components/HelloWorld";
import UserAuth from "./components/UserAuth";

export default {
  name: "App",

  components: {
    // HelloWorld,
    UserAuth,
  },
};
</script>
