'use strict';

angular.module('demoApp.config', [])
  .constant('LOGIN_URL', 'http://myapp/api/Sample/Login')
  .constant('EMPLOYES_LIST_URL', 'http://myapp/api/Sample/List?token=')
  .constant('DEFAULT_STATE', 'dashboard')
  .constant('AUTH', {
    sessionKey: 'appSession',
    userDataKey: 'appUserData',
    loginSuccessEvent: 'loginSuccess',
    logoutSuccessEvent: 'logoutSuccess'
  })
  .constant('PAGIN', {
    startPageIndex: 1,
    count: 10,
  })
  .constant('USER_ROLES', {
    all: '*',
    guest: 'guest',
    user: 'user'
  });