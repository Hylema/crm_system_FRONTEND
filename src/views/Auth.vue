<!-- Будет переделана -->
<!--922b3e-->
<!--1f3a3d-->
<!--b9bbbe-->
<template>
  <v-container fluid style="height: 100%; padding: 0px">
    <!--        <kinesis-container>-->
    <!--            <kinesis-element :strength="10">-->
    <!--                <v-img src="https://picsum.photos/1920/1080?random"></v-img>-->
    <!--            </kinesis-element>-->
    <!--            <kinesis-element :strength="20">-->
    <!--            </kinesis-element>-->
    <!--        </kinesis-container>-->

    <v-img :src="themeIsDark ? require('@/assets/images/darkBackgroundImage.jpg') : require('@/assets/images/lightBackgroundImage.jpg')" style="position: absolute; left: 0; top: 0" width="100%" height="100%"
           gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)">
    </v-img>

    <v-layout align-center justify-center fill-height>
      <v-form
          class="card-width"
          ref="form"
          v-model="valid"
      >
        <v-card class="background card-width">
          <v-progress-linear
              color="action"
              v-bind="vProgressLinear"
              :active="loading"
              :indeterminate="loading"
          ></v-progress-linear>

          <v-card-title>
            <v-layout align-center justify-center row fill-height v-bind:style="title">
              <h2>Авторизация</h2>
            </v-layout>
          </v-card-title>

          <v-card-text>
            <v-text-field
                color="action"
                v-bind="vTextFieldEmail"
                v-model="email"
                :error="false"
                :rules="emailRules"
                style="padding: 0px; margin: 0px !important;"
                :error-messages="emailErrorMessage"
            ></v-text-field>

            <v-text-field
                color="action"
                v-bind="vTextFieldPassword"
                v-model="password"
                :rules="passwordRules"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
                style="padding: 0px; margin: 0px !important;"
                :error-messages="passwordErrorMessage"
            ></v-text-field>

            <v-btn
                block
                :disabled="!valid && emailErrorMessage.length === 0 && passwordErrorMessage.length === 0"
                class="mr-4 action"
                @click="validate"
                height="60"
                :loading="loading"
            >
              <div style="color: white">Вход</div>
            </v-btn>
            <v-layout justify-end>
              <button type="button" >
                <div style="color: #7289da; font-weight: bold">  Забыли пароль?</div>
              </button>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-form>
    </v-layout>
  </v-container>
</template>
<script>
import stompConnect from "@/plugins/ws";
import {mapState} from "vuex";

export default {
  created() {
    window.addEventListener('keypress', this.keypress);
  },
  destroyed() {
    window.removeEventListener('keypress', this.keypress);
  },
  data() {
    return {
      emailErrorMessage: '',
      passwordErrorMessage: '',
      valid: true,
      show: false,
      loading: false,
      email: null,
      emailRules: [
        v => !!v || 'Поле с E-mail не должно быть пустым',
        v => /.+@.+\..+/.test(v) || 'E-mail не верный',
        // v => {
        //   if(this.emailErrorMessage !== ''){
        //     if(v === this.emailErrorMessage){
        //       return this.responseErrorMessage
        //     }
        //   } else return true
        // },
      ],
      password: null,
      passwordRules: [
        v => !!v || 'Поле с паролем не должно быть пустым',
        v => (v && v.length >= 3) || 'Пароль слишком короткий',
        // v => {
        //   console.log(this, 'this')
        //
        //   if(this.passwordErrorMessage !== ''){
        //     if(v === this.passwordErrorMessage){
        //       return this.responseErrorMessage
        //     }
        //   } else return true
        // },
      ],
      title: {
        padding: '40px'
      },
    }
  },
  computed: {
    themeIsDark: {
      get(){
        let isDark = this.$store.getters['theme/themeIsDark'];

        this.$vuetify.theme.dark = isDark;
        return isDark;
      },
    },
    vTextFieldEmail: vm => ({
      outlined: true,
      autofocus: true,
      // color: theme.actions,
      label: 'E-mail',
      clearable: true,
    }),
    vTextFieldPassword: vm => ({
      outlined: true,
      autofocus: false,
      // color: theme.actions,
      label: 'Password',
      type: 'Password',
      clearable: true,
    }),
    vProgressLinear: vm => ({
      absolute: true,
      top: true,
      height: 7
    }),
    vCard: vm => ({
      //width: 500,
    }),
  },
  methods: {
    keypress(e){
      if(e.keyCode === 13){
        if(this.valid){
          this.validate()
        }
      }
    },
    validate () {
      this.loading = true;
      this.emailErrorMessage = ''
      this.passwordErrorMessage = ''

      this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password,
      }).then(response => {
        console.log(response, 'response')

        if(response !== null && response !== undefined){
          this.loading = false;
          this.$refs.form.reset();

          this.$router.push({
            name: 'Home'
          })

          stompConnect()
        }
      }).catch(error => {
        if(error.message.charAt(0) === 'E') this.emailErrorMessage = error.message
        else if(error.message.charAt(0) === 'P') this.passwordErrorMessage = error.message

        console.log(error, 'error')
        this.loading = false;
        this.valid = true;
      })
    }
  },
}
</script>
<style scoped>
.card-width{
  min-width: 500px;
  width: 500px;
}
@media only screen and (max-width: 500px) {
  .card-width{
    width: 100%;
    height: 100%;
    min-width: 100%;
  }
}
</style>
