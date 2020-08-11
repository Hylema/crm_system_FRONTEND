export const DialogTypes = {
  INSPECTIONS: 'inspections',
  TECHNICAL_PLACE: 'technicalPlace'
};

export const NavigationDrawer = {
  MOBILE_HEADER: 'mobileHeader'
};

export const SnackBars = {
  SNACK_BARS_NO_DATA: 'snackBarsNoData'
};

export const IterationCycle = {
  // ROUTES: ['operations', 'subOperations'],
  // ORDERS: ['operations', 'components'],
};

export const Items = {
  ROUTES: 'routes',
  ORDERS: 'orders',
};

export const theme = {
  actions: '#7289da',
  background: '#36393f',
  text: '#b9bbbe',
  textTitle: 'white',
};

export const RouteNames = {
  TASKS: 'Tasks',
};
// 'http://193.176.79.41/auth/token/'
const HOST = "http://193.176.79.41/"

export const Api = {
  AUTH: "auth/user/login/",
  TOKEN_VERIFY: '/auth/user/token/verify/',
  REFRESH_TOKEN: '/auth/user/token/refresh/',

  GET_All_USERS: '/auth/user/list',
  CREATE_USER: '/auth/user/create/',
  UPDATE_USER: '/auth/user/change/',
  DELETE_USER: '/auth/user/change/',

  GET_ALL_TASKS: '/tasks/alltasks/',
  GET_TASK_DETAILS: '/tasks/detail',
  MAKE_TASK_COMMENT: '/tasks/comments/',
  CREATE_TASK: '/tasks/maketask/'
};