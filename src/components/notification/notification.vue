<template>
    <notifications
            group="Api"
            position="bottom right"
    >
        <template slot="body" slot-scope="props">
            <v-hover
                    v-slot:default="{ hover }"
            >
                <v-card
                        @click.stop="showJson(props.item.data)"
                        color="background"
                        v-bind="vAlert"
                        :elevation="hover ? 16 : 2"
                        style="margin: 10px; cursor: pointer"
                >
                    <v-layout justify-space-between>
                        <v-card-title>
                            Статус код: <span :class="props.item.type + '--text'" style="padding-left: 10px">{{ props.item.title }}</span>
                        </v-card-title>

                        <v-card-title>
                            <v-btn class="mx-2" fab dark small color="action" @click="props.close"><v-icon>close</v-icon></v-btn>
                        </v-card-title>
                    </v-layout>

                    <v-card-text :style="{color: props.item.type}">
                        {{ props.item.text }}
                    </v-card-text>
                </v-card>
            </v-hover>

            <json_tree :dialog="dialog" :json="props.data"></json_tree>
        </template>
    </notifications>
</template>
<!--:color="props.item.type"-->
<script>
    import json_tree from '../../components/dialogs/json_tree'
    import { theme } from '../../constants'
    export default {
        name: "notification",
        components: {
            json_tree
        },
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
            showJson(json){
                console.log(json, 'json')

                this.$store.dispatch('notification/showJson', {
                    dialog: true,
                    json: json
                })
            }
        }
    }
</script>

<style scoped>

</style>