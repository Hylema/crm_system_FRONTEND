import Vue from 'vue'
import { Api } from '@/constants'

const state = {};

const actions = {
    // async downloadFile({ commit, dispatch }, file){
    //     Vue.axios.get(`${Api.FILES.DOWNLOAD}/${file.uuidName}`)
    // },
    async uploadsFiles({ commit, dispatch }, files){
        let formData = new FormData()

        if(files.length > 0){
            files.forEach((file) => formData.append('files', file))
        }

        return await Vue.axios.post(Api.FILES.UPLOADS, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            Vue.notify({
                group: 'Api',
                title: `${response.status}`,
                data: response,
                text: 'Файл успешно загружен',
                type: 'success',
                duration: 1000000
            });

            return response
        }).catch(error => {
            Vue.notify({
                group: 'Api',
                title: `${error.response.status}`,
                data: error.response,
                text: 'Не удалось загрузить файл',
                type: 'error',
                duration: 1000000
            });
        })
    },
};

const mutations = {};

const getters = {};

export default {
    state,
    getters,
    actions,
    mutations,
    namespaced: true
}