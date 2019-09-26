<template>
    <v-container fluid px-0>
        <v-toolbar color="white">
            <v-toolbar-title class="grey--text">Users</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn to="/user/create" color="green" dark class="mb-2">Add new user</v-btn>
        </v-toolbar>
        <v-data-table
            :headers="gridHeaders"
            :items="users"
            :pagination.sync="pagination"
            :loading="isLoading"
            :total-items="userCount"
            class="elevation-1"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.username }}</td>
                <td>{{ props.item.email }}</td>
                <td>{{ props.item.isAdmin ? 'Yes' : 'No' }}</td>
                <td>

                    <router-link
                        v-show="props.item._id !== user._id"
                        tag="v-icon"
                        :to="`/user/edit/${props.item._id}`"
                        small
                        class="mr-2"
                    >
                        edit
                    </router-link>
                    <v-icon
                        class="cursorPointer"
                        v-show="props.item._id !== user._id"
                        @click="removeUser(props.item)"
                    >
                        delete
                    </v-icon>
                </td>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "UserList",
  data() {
    return {
      pagination: {
        rowsPerPage: 10
      },
      gridHeaders: [
        { text: "Username", value: "username", sortable: false },
        { text: "E-mail", value: "email", sortable: false },
        { text: "Administrator", value: "isAdmin", sortable: false },
        { text: "Actions", value: "name", sortable: false }
      ]
    };
  },
  watch: {
      pagination: {
          deep: true,
          handler: function() {
              this.fetchUsers ({
                  page: this.pagination.page,
                  limit: this.pagination.rowsPerPage
              })
          }
      }
  },
  methods: {
    ...mapActions(["fetchUsers", "deleteUser"]),
    removeUser(user) {
        let confirmResult = confirm (`Are you sure to delete user ${user.username}`)
        if (confirmResult){
            this.deleteUser(user._id).then(() => {
                this.fetchUsers()
            })
        }
    }
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      users: "getUsers",
      isLoading: "getLoader",
      userCount: "getUsersCount"
    })
  }
};
</script>

<style scoped>
    cursorPointer {
        cursor:  pointer;
    }
</style>

