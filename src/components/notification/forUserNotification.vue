<template>
  <notifications
      group="User"
      position="bottom right"
      style="width: 500px;"
  >
    <template slot="body" slot-scope="props">
      <v-hover
          v-slot:default="{ hover }"
      >
        <v-card
            width="400"
            color="background"
            @click.stop="openTask(props.item.data)"
            v-bind="vAlert"
            :elevation="hover ? 16 : 2"
            style="margin: 10px; cursor: pointer"
        >
          <v-layout justify-space-between>
            <v-card-title>
              {{ props.item.title }}
            </v-card-title>

            <v-card-title>
              <v-btn class="mx-2" fab dark small color="action" @click.stop="props.close"><v-icon>close</v-icon></v-btn>
            </v-card-title>
          </v-layout>

          <v-card-text :style="{color: props.item.type}">
            {{ props.item.text }}
          </v-card-text>
        </v-card>
      </v-hover>
    </template>
  </notifications>
</template>

<script>
import taskUtil from "@/mixins/utils/task"
export default {
  name: "forUserNotification",
  mixins: [taskUtil],
  data: () => {
    return {
      dialog: false,
    }
  },
  computed: {
    vAlert: vm => ({
      dismissible: true,
      prominent: true,
    }),
  },
  methods: {
    // showJson(json){
    //   this.$store.dispatch('notification/showJson', {
    //     dialog: true,
    //     json: json
    //   })
    // }
  }
}
</script>

<style scoped>

</style>