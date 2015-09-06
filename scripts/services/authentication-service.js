'use strict';
angular.module('demoApp.security', [])
  .factory('AuthenticationService', function($q, $http, $rootScope, $location,
    LOGIN_URL, Session) {


    return {
      login: function(username, password) {
        var credentials = {
          'user': username,
          'password': password
        };

        if (!credentials.username && !credentials.password) {
          throw new Error('AuthenticationService.login() requires ' +
            'a plain object including username and password');
        }
        var configRequest = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        return $http.post(LOGIN_URL, credentials, configRequest)
          .then(function(res) {
            var userData= null;
            if(res.data.token) {
              userData = {
                token:res.data.token,
                account: {
                  user:res.data.fullname,
                  role: 'user'
                }
              };
              Session.create(userData);
            }
            return res.data;
          });
      },

      logout: function() {
        Session.destroy();
      }
    };
  });