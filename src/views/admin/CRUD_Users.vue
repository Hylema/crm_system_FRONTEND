<template>
  <v-data-table
      :options="{itemsPerPage: 100}"
      :items-per-page-options="[30, 50, 100]"
      :headers="headers"
      :items="users"
      page-text="page-text"
      class="elevation-1"
      :loading="loadingTable"
  >
    <template v-slot:item.firstName="{ item }">
      <v-edit-dialog
          @cancel="firstNameDialog = false"
          @open="firstNameDialog = true"
          @save="patchThis({
            id: item.id,
            firstName: item.firstName
          })"
      > {{ item.firstName }}
        <template v-slot:input>
          <v-text-field
              v-model="item.firstName"
              label="Edit"
              single-line
              counter
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.lastName="{ item }">
      <v-edit-dialog
          @cancel="lastNameDialog = false"
          @open="lastNameDialog = true;"
          @save="patchThis({
            id: item.id,
            lastName: item.lastName
          })"
      > {{ item.lastName }}
        <template v-slot:input>
          <v-text-field
              v-model="item.lastName"
              label="Edit"
              single-line
              counter
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.email="{ item }">
      <v-edit-dialog
          @cancel="emailDialog = false"
          @open="emailDialog = true"
          @save="patchThis({
          id: item.id,
            email: item.email
          })"
      > {{ item.email }}
        <template v-slot:input>
          <v-text-field
              v-model="item.email"
              label="Edit"
              single-line
              counter
          ></v-text-field>
        </template>
      </v-edit-dialog>
    </template>

    <template v-slot:item.roles="{ item }">
      <v-tooltip bottom v-for="role in item.roles">
        <template v-slot:activator="{ on, attrs }">
          <v-chip
              color="action"
              dark
              v-bind="attrs"
              v-on="on"
          >{{ role.name | onlyFirstSymbol }}</v-chip>
        </template>
        <span>{{ role.name }}</span>
      </v-tooltip>
    </template>

    <template v-slot:item.lastVisit="{ item }">
      {{ item.lastVisit | dateFilter }}
    </template>

    <template v-slot:top>
      <v-toolbar flat color="background">
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="action"
                dark
                class="mb-2"
                @click="createUser()"
            >Создать пользователя</v-btn>
          </template>
          <v-card class="background">
            <v-progress-linear
                color="action"
                v-bind="vProgressLinear"
                :active="loadingDialog"
                :indeterminate="loadingDialog"
            ></v-progress-linear>
            <v-layout justify-space-between>
              <v-card-title class="headline">{{ formTitle }}</v-card-title>
              <v-card-title><v-btn class="mx-2" fab dark small color="action" @click="dialog = false"><v-icon>close</v-icon></v-btn></v-card-title>
            </v-layout>

            <v-divider style="margin: 0px"></v-divider>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field clearable outlined color="action" v-model="editedUser.email" label="E-mail"></v-text-field>
                    <v-text-field clearable outlined color="action" v-model="editedUser.firstName" label="Имя"></v-text-field>
                    <v-text-field clearable outlined color="action" v-model="editedUser.lastName" label="Фамилия"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="action" dark text @click="save">{{ actionTitle }}</v-btn>
              <v-btn class="action" dark text @click="close">Назад</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
          small
          @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "CRUD_Users",
  data: () => ({
    dialog: false,
    firstNameDialog: false,
    lastNameDialog: false,
    emailDialog: false,
    loadingDialog: false,
    loadingTable: false,
    headers: [
      {
        text: 'id',
        align: 'start',
        sortable: false,
        value: 'id',
      },
      { text: 'email', value: 'email' },
      { text: 'Фамилия', value: 'lastName' },
      { text: 'Имя', value: 'firstName' },
      { text: 'Роли пользователя', value: 'roles' },
      { text: 'Последний раз в сети', value: 'lastVisit' },
      { text: 'Действия', value: 'actions', sortable: false },
    ],
    editedUser: {
      id: null,
      email: '',
      firstName: '',
      lastName: '',
    },
    defaultUser: {
      email: '',
      firstName: '',
      lastName: '',
    },
    formTitle: '',
    actionTitle: '',
    create: null,
  }),

  computed: {
    users: vm => vm.$store.getters['admin/users'],
    vProgressLinear: vm => ({
      absolute: true,
      top: true,
      height: 7
    }),
  },

  methods: {
    patchThis(data){
      this.$stomp.send("/app/patchUser", {}, JSON.stringify(data))
    },

    createUser(){
      this.editedUser = Object.assign({}, this.defaultUser);
      this.formTitle = 'Создание пользователя'
      this.actionTitle = 'Создать'
      this.dialog = true
      this.create = true
    },

    editItem (item) {
      this.formTitle = 'Редактирование пользователя'
      this.actionTitle = 'Изменить'
      this.editedIndex = item.id
      this.editedUser = Object.assign({}, item)
      this.dialog = true
      this.create = false
    },

    deleteItem (user) {
      confirm('Are you sure about that?') && this.$stomp.send("/app/deleteUser", {}, JSON.stringify({
        id: user.id
      }))
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser)
      })
    },

    save () {
      this.loadingDialog = true;

      if(this.create){
        this.editedUser["roleIds"] = [2]

        this.$stomp.send("/app/createUser", {}, JSON.stringify(this.editedUser))
      } else {
        this.$stomp.send("/app/putUser", {}, JSON.stringify(this.editedUser))
      }
    },
  },
}
</script>

<style scoped>

</style>