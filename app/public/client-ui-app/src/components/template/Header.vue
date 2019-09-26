<template>
<div>
  <v-toolbar class="primary">
    <v-toolbar-side-icon
      @click.native.stop="sideNav = !sideNav"
      class="hidden-md-and-up white--text">
    </v-toolbar-side-icon>

    <v-toolbar-title class="white--text">
      <router-link to="/" class="white--text" >
        <v-icon left>all_inclusive</v-icon>
        Smart socket
      </router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items class="hidden-sm-and-down">
      <!-- Main navigation here -->
      <v-btn v-for="(link, key) in menuItems" :key="key"
            :to="link.to" v-if="link.show" flat class="white--text" >
        <v-icon left>{{link.icon}}</v-icon>
        {{link.text}}
      </v-btn>

    <v-menu offset-y v-show="isLogged">
      <v-btn
        flat
        class="white--text"
        slot="activator"
      >
        Welcome, <b>{{user.username}}</b>
        <v-icon right>keyboard_arrow_down</v-icon>
      </v-btn>

      <v-list>
        <v-list-tile to="/user/edit">
          <v-list-tile-avatar>
            <v-icon left>settings</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/" @click="logout">
          <v-list-tile-avatar>
            <v-icon left>exit_to_app</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-menu>
    </v-toolbar-items>
  </v-toolbar>

  <v-navigation-drawer v-model="sideNav" class="primary" absolute temporary>
    <v-list>
      <router-link tag="v-list-tile" v-for="(link, key) in menuItems" :key="key" :to="link.to" v-show="link.show">
        <v-list-tile-action>
          <v-icon left>{{link.icon}}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ link.text }}</v-list-tile-title>
        </v-list-tile-content>
      </router-link>

      <router-link tag="v-list-tile" to="/user/edit" v-show="isLogged">
          <v-list-tile-action>
            <v-icon left>settings</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
      </router-link>

      <v-list-tile @click="logout" v-show="isLogged">
          <v-list-tile-action>
            <v-icon left>exit_to_app</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>

  <v-progress-linear class="ma-0" :active="isLoading" height="8" color="blue lighten-2" indeterminate></v-progress-linear>
</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      sideNav: false
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'getLoader',
      user: "getUser",
      isLogged: "isLogged"
    }),
    isLogged() {
      return this.$store.getters.isLogged;
    },
    menuItems() {
      return [
        { to: "/", text: "Sign In", show: !this.isLogged, icon: "lock" },
        {
          to: "/home",
          text: "Dashboard",
          show: this.isLogged,
          icon: "dashboard"
        },
        {
          to: "/users",
          text: "Users",
          show: this.isLogged && this.user.isAdmin,
          icon: "people"
        }
      ];
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
