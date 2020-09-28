<template>
  <span>
      <v-toolbar flat color="background" dense>
    <v-btn
        color="action"
        dark
        class="mr-2"
        @click="filter({ all: true })"
        active-class="background"
    >Все</v-btn>

    <v-btn
        :color="filters.author !== true ? 'action' : 'activeAction'"
        dark
        class="mr-2"
        @click="filter({ author: filters.author !== true })"
    >Автор</v-btn>

    <v-btn
        :color="filters.responsible !== true ? 'action' : 'activeAction'"
        dark
        class="mr-2"
        @click="filter({ responsible: filters.responsible !== true })"
    >Ответственный</v-btn>

    <v-btn
        :color="filters.observers !== true ? 'action' : 'activeAction'"
        dark
        class="mr-2"
        @click="filter({ observers: filters.observers !== true })"
    >Наблюдатель</v-btn>

    <v-btn
        :color="filters.deleted !== true ? 'action' : 'activeAction'"
        dark
        class="mr-2"
        @click="filter({ deleted: filters.deleted !== true })"
    >Удаленные</v-btn>

    <v-spacer></v-spacer>

    <v-btn
        color="action"
        dark
        @click="preCreateTask()"
    >Создать задачу</v-btn>
  </v-toolbar>
      <v-toolbar flat color="background">
    <v-combobox
        clearable
        :item-text="'name'"
        dense
        :color="filters.status !== null ? 'action' : 'activeAction'"
        outlined
        :items="allTaskStatus"
        :rules="StatusRules"
        label="Статус"
        @change="handlerInputStatus"
        class="mt-7"
        style="max-width: 200px;"
    ></v-combobox>

    <v-text-field
        :color="filters.search !== null ? 'action' : 'activeAction'"
        clearable
        outlined
        label="Поиск"
        dense
        class="mt-7 ml-2"
        style="max-width: 200px;"
        @input="handlerInputSearch"
    >
    </v-text-field>

    <v-menu
        ref="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
        v-model="menuDatePickerPeriodFrom"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
            style="max-width: 200px;"
            class="mt-7 ml-2"
            color="action"
            :rules="menuDatePickerPeriodFromRules"
            outlined
            dense
            v-model="periodFromTextFieldModel"
            label="Период с"
            prepend-inner-icon="event"
            :hide-details="false"
            readonly
            clearable
            v-bind="attrs"
            v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="datePickerPeriodFromModel" scrollable locale="ru">
        <v-spacer></v-spacer>
        <v-btn text dark class="action" @click="">OK</v-btn>
        <v-btn text dark class="action" @click="menuDatePickerPeriodFrom = false">Назад</v-btn>
      </v-date-picker>
    </v-menu>

    <v-menu
        ref="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
        v-model="menuDatePickerPeriodTo"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
            style="max-width: 200px;"
            class="mt-7 ml-2"
            color="action"
            :rules="menuDatePickerPeriodToRules"
            outlined
            dense
            v-model="periodToTextFieldModel"
            label="Период по"
            prepend-inner-icon="event"
            :hide-details="false"
            readonly
            clearable
            v-bind="attrs"
            v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="datePickerPeriodToModel" scrollable locale="ru">
        <v-spacer></v-spacer>
        <v-btn text dark class="action" @click="">OK</v-btn>
        <v-btn text dark class="action" @click="menuDatePickerPeriodTo = false">Назад</v-btn>
      </v-date-picker>
    </v-menu>
      </v-toolbar>
  </span>
</template>

<script>
import taskUtil from "@/mixins/utils/task"
export default {
  name: "taskFilter",
  mixins: [taskUtil],
  data(){
    return {
      periodFromTextFieldModel: null,
      periodToTextFieldModel: null,
      datePickerPeriodFromModel: false,
      datePickerPeriodToModel: false,
      menuDatePickerPeriodFrom: false,
      menuDatePickerPeriodTo: false,
      menuDatePickerPeriodFromRules: [
        v => !!v || 'Это поле обязательно для заполнения',
      ],
      menuDatePickerPeriodToRules: [
        v => !!v || 'Это поле обязательно для заполнения',
      ],
      StatusRules: [
        v => {
          if(typeof v === 'object' || v === null || v === ''){
            return true
          } else {
            return 'Такого статуса не существует'
          }
        },
      ],
    }
  },
  computed: {
    allTaskStatus: vm => vm.$store.getters["tasks/allTaskStatus"],
  },
  methods: {
    preCreateTask(){
      this.$store.dispatch("tasks/preCreateTaskDialog")
    },
    handlerInputStatus(status){
      console.log(status)

      if(status != null && typeof status === 'object'){

        console.log(status, 'status')

        this.filter({
          status: status.id
        })
      } else if(status === null || status === ''){
        this.filter({
          status: null
        })
      }
    },
    handlerInputSearch(searchText){
      if(searchText !== null && searchText !== undefined && searchText !== ''){
        const search = `${searchText}`

        if(search.length >= 3){
          this.filter({
            search: search
          })
        }
      } else {
        this.filter({
          search: null
        })
      }
    }
  }
}
</script>

<style scoped></style>