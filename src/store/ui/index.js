import { NavigationDrawer } from '../../constants'
import { DialogTypes } from '../../constants'
import { SnackBars } from '../../constants'

const createState = widgetNames => Object
  .values(widgetNames)
  .reduce((obj, key) => (obj[key] = false, obj), {});

const state = {
  header: false,
  widgets: {
    ...createState(NavigationDrawer),
    ...createState(DialogTypes),
    ...createState(SnackBars),
  },
  redirectPath: ''
};

const mutations = {
  SET_WIDGET_VISIBILITY (state, widget) {
    state.widgets[widget.name] = widget.value
  },
};

export default {
  state,
  mutations,
  namespaced: true,
}
