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

// export const BackendUrl = 'http://localhost:9090'
export const BackendUrl = 'https://crm-system-aegis-backend.herokuapp.com'

export const Api = {
  AUTHORIZATION: {
    AUTH: "/api/v1/auth/login/",
    TOKEN_VERIFY: '/api/v1/auth/verify/',
    REFRESH_TOKEN: '/api/v1/auth/refresh/',
    USER: '/api/v1/auth/user',
  },

  USERS: {
    GET_All_USERS: '/api/v1/users/',
    CREATE_USER: '/api/v1/users/user/create/',
    UPDATE_USER: '/api/v1/users/user/',
    PATCH_USER: '/api/v1/users/user/',
    DELETE_USER: '/api/v1/users/user/',
  },

  USER: {
    CHANGE_AVATAR: '/api/v1/user/avatar',
  },

  TASKS: {
    GET_ALL_TASKS: '/api/v1/tasks',
    GET_TASK_DETAILS: '/tasks/detail',
    MAKE_TASK_COMMENT: '/tasks/comments/',
    CREATE_TASK: '/tasks/maketask/'
  },

  FILES: {
    UPLOAD: '/api/v1/files/upload',
    UPLOADS: '/api/v1/files/uploads',
    DOWNLOAD: '/api/v1/files/download',
  }
};