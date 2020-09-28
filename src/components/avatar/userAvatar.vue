<template>
  <span>
    <v-tooltip bottom v-if="user.avatar" color="activeAction">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar v-on="on" v-bind="attrs" class="mr-2" :size="size === null ? 40 : size">
            <v-img :src="user.avatar.download"></v-img>
          </v-avatar>
        </template>
        <strong class="ml-1">{{ `${user.lastName} ${user.firstName}` }}</strong>
    </v-tooltip>
    <v-tooltip bottom v-else color="activeAction">
        <template v-slot:activator="{ on, attrs }">
            <v-avatar v-on="on" v-bind="attrs" color="action" dark class="mr-2 white--text" :size="size === null ? 40 : size">
              <strong>{{ user.lastName | onlyFirstSymbolToUpperCase }}</strong>
              <strong>{{ user.firstName | onlyFirstSymbolToUpperCase }}</strong>
            </v-avatar>
        </template>
        <strong class="ml-1">{{ `${user.lastName} ${user.firstName}` }}</strong>
    </v-tooltip>
  </span>
</template>

<script>
export default {
  name: "userAvatar",
  props: {
    user: Object,
    size: Number
  }
}
</script>

<style scoped>

</style>