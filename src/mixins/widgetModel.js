export default (widgetName, computedPropertyName = 'dialog') => ({
  computed: {
    ['$_widgetModel_' + computedPropertyName]: {
      get () {
        return this.$store.state.ui.widgets[widgetName]
      },
      set (v) {
        console.log(v, 'v')
        this.$store.commit('ui/SET_WIDGET_VISIBILITY', {
          name: widgetName,
          value: v
        })
      }
    }
  }
})
