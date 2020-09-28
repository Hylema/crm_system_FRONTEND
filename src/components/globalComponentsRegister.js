import backToTop from "@/components/backButton/backButton";
import createUpdateTask from "@/components/dialogs/createUpdateTask";
import taskFilter from "@/components/filters/task/taskFilter";
import userAvatar from "@/components/avatar/userAvatar";
import twemoji from "@/components/emoji/twemoji";
import files from "@/components/files/taskFiles";

export default {
    install(Vue) {
        Vue.component('back-to-top', backToTop)
        Vue.component('create-update-task', createUpdateTask)
        Vue.component('task-filter', taskFilter)
        Vue.component('user-avatar', userAvatar)
        Vue.component('twemoji', twemoji)
        Vue.component('task-files', files)
    }
}