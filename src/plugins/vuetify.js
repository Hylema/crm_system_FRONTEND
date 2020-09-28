import Vue from 'vue';
import Vuetify from 'vuetify/lib';
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        light: false,
        themes: {
            light: {
                background: '#edeef0',
                background_lighter: '#FFFFFF',
                action: '#4a76a8',
                text: '#000000',
                activeAction: '#809fc2',
                tableColor: '#ffffff',
            },
            dark: {
                primary: '#1976D2',
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',

                tableColor: '#282d47',
                activeAction: '#6b79aa',
                action: '#3e455f',
                background: '#1a1d2c',
                background_to: '#33333f',
                text: '#b9bbbe',
            },
        },
    },
});
