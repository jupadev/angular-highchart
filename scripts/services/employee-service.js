'use strict';
angular.module('demoApp.employee', [])
  .factory('EmployeeService', function($q, $http, EMPLOYES_LIST_URL) {

    return {
      getList: function(token) {
        if (!token) {
          throw new Error('EmployeeService.getList() requires ' +
            'a token key');
        }
        var configRequest = {
            headers: {
              'Content-Type': 'application/json'
            }
          },
          url = EMPLOYES_LIST_URL + token;

        return $http.get(url, {}, configRequest)
          .then(function(res) {
            return res.data;
          });
      }

    };
  });