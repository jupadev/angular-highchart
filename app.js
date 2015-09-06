 var demoApp = angular.module("demoApp", [
  'ngRoute',
  'ngResource',
  'ui.router',
  'highcharts-ng',
  'ngTable',
  'ui.bootstrap',
  'dndLists',
  'demoApp.config',
  'demoApp.security',
  'demoApp.serices.common',
  'demoApp.login',
  'demoApp.dashboard',
  'demoApp.employee',
  'demoApp.mockup',
  'demoApp.directives'
  ])
   .run(function(
     $rootScope, $state, $stateParams, Session,
     AUTH, DEFAULT_STATE
   ) {

     $rootScope.$on(
       '$stateChangeStart',
       function(event, toState, toParams, fromState) {
        var authorizedRoles = toState.data ? toState.data.authorizedRoles : null,
        isAuthenticated = Session.isAuthenticated();
        if (!Session.isAuthorized(authorizedRoles)) {
          preventStateChange(event);
          if (isAuthenticated) {
            redirectToDefault(fromState);
          } else {
            $state.go('login');
          }
        } else {
          if (isAuthenticated && toState.name === 'login') {
           preventStateChange(event);
           redirectToDefault(fromState);
         }
        }
         
       });

     function preventStateChange(e) {
      e.preventDefault();
     }

     function redirectToDefault(fromState) {
       if (!fromState.name || fromState.name === 'login') {
         $state.go(DEFAULT_STATE);
       }
     }
   })
   .config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
     $urlRouterProvider.otherwise('/');

     $stateProvider
       .state('login', {
         url: '/login',
         templateUrl: 'scripts/login/login.html',
         controller: 'LoginController',
         data: {
           authorizedRoles: [USER_ROLES.guest]
         }

       });

     $stateProvider
       .state('dashboard', {
         url: '/dashboard',
         templateUrl: 'scripts/dashboard/dashboard.html',
         controller: 'DashboardController',
         data: {
           authorizedRoles: [USER_ROLES.user]
         }
       });

       $stateProvider
       .state('mockup', {
         url: '/mockup',
         templateUrl: 'scripts/mockup/mockup.html',
         controller: 'MockupController',
         data: {
           authorizedRoles: [USER_ROLES.user]
         }
       });

   });