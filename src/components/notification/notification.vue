<template>
    <notifications
            group="Api"
            position="bottom right"
    >
        <template slot="body" slot-scope="props">
            <v-alert
                    :type="props.item.type"
                    v-bind="vAlert"
            >
                <h2>Группа Api</h2>
                <div>
                    Статус код: {{ props.item.title }}
                </div>
                <div>Сообщение: {{ props.item.text }}</div>
            </v-alert>
        </template>
    </notifications>
</template>

<script>
    import { theme } from '../../constants'
    export default {
        name: "notification",
        data: () => {
            return {

            }
        },
        computed: {
            vAlert: vm => ({
                dismissible: true,
                prominent: true,
                border: 'right'
            }),
        }
    }
</script>

<style scoped>

</style>