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
                    <v-card>
                        <v-progress-linear
                                color="action"
                                v-bind="vProgressLinear"
                                :active="loadingDialog"
                                :indeterminate="loadingDialog"
                        ></v-progress-linear>

                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field v-model="editedUser.email" label="E-mail"></v-text-field>
                                        <v-text-field v-model="editedUser.first_name" label="Имя"></v-text-field>
                                        <v-text-field v-model="editedUser.last_name" label="Фамилия"></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="save">{{ actionTitle }}</v-btn>
                            <v-btn color="blue darken-1" text @click="close">Назад</v-btn>
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
        mounted() {
            this.$store.dispatch('admin/getAllUsers');
        },
        data: () => ({
            dialog: false,
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
                { text: 'Фамилия', value: 'last_name' },
                { text: 'Имя', value: 'first_name' },
                { text: 'Действия', value: 'actions', sortable: false },
            ],
            editedIndex: -1,
            editedUser: {
                email: '',
                first_name: '',
                last_name: '',
            },
            defaultUser: {
                email: '',
                first_name: '',
                last_name: '',
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
            // formTitle () {
            //     return this.editedIndex === -1 ? 'Создание пользователя' : 'Изменение пользователя'
            // },
        },

        methods: {
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

            deleteItem (item) {
                confirm('Are you sure about that?') && this.$store.dispatch('admin/deleteUser', item.id).then(success => {
                    if(success){
                        this.$store.dispatch('admin/getAllUsers')
                    }
                })
            },

            close () {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedUser = Object.assign({}, this.defaultUser)
                    this.editedIndex = -1
                })
            },

            save () {
                this.loadingDialog = true;

                if(this.create){
                    this.$store.dispatch('admin/createUser', this.editedUser).then(success => {
                        if(success){
                            this.loadingDialog = false;
                            this.loadingTable = true;
                            this.dialog = false;

                            this.$store.dispatch('admin/getAllUsers').then(res => {
                                this.loadingTable = false;
                            })
                        } else {
                            this.loadingDialog = false;
                        }
                    })
                } else {
                    this.$store.dispatch('admin/updateUser', {
                        id: this.editedIndex,
                        data: this.editedUser
                    }).then(success => {
                        if(success){
                            this.loadingDialog = false;
                            this.loadingTable = true;
                            this.dialog = false;

                            this.$store.dispatch('admin/getAllUsers').then(res => {
                                this.loadingTable = false;
                            })
                        } else {
                            this.loadingDialog = false;
                        }
                    })
                }
            },
        },
    }
</script>

<style scoped>

</style>