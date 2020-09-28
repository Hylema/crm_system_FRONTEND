<template>
  <v-list v-if="files.length > 0" dense style="padding: 0 !important;" class="background">
    <template v-for="(file, index) in files">
      <v-list-item>
        <template v-slot:default="{ active, toggle }">
          <v-list-item-content>
            <v-list-item-title v-text="file.name"></v-list-item-title>
            <v-list-item-subtitle v-if="file.size" class="text--primary" v-text="getFileSize(file.size)"></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-icon
                @click="remove(index)"
            >
              close
            </v-icon>
          </v-list-item-action>
        </template>
      </v-list-item>

      <v-divider
          v-if="index + 1 < files.length"
          :key="index"
          style="padding: 0; margin: 0"
      ></v-divider>
    </template>
  </v-list>
</template>

<script>
import filesize from "filesize";
import {mapState} from "vuex";
  export default {
    name: "taskFiles",
    props: {
      files: Array
    },
    methods: {
      getFileSize(size){
        return filesize(size)
      },
      remove(index){
        this.$emit('removeFile', index)
      }
    },
    computed: {}
  }
</script>

<style scoped>

</style>