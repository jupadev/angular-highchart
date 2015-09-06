angular.module('demoApp.security')
  .service('Session', function($window, storageService, AUTH) {

    var DEFAULT_ROLE = 'user';

    function sessionConfig(key) {
      var cache = null;
      return function(data) {
        if (data) {
          storageService.setData(key, data);
          cache = data;
        } else if (data === null) {
          storageService.removeData(key);
          cache = null;
        } else {
          if (!cache) {
            cache = storageService.getData(key);
          }
        }
        return cache || null;
      };
    }

    function roleDefined(accountSettinsData) {
      return accountSettinsData && accountSettinsData.role;
    }

    function appendDefaultRole(accountSettingsData) {
      accountSettingsData = accountSettingsData || {};
      accountSettingsData.role = DEFAULT_ROLE;
    }

    var account = sessionConfig(AUTH.userDataKey),
      authorizationToken = sessionConfig(AUTH.sessionKey);

    return {

      create: function(data) {
        authorizationToken(data.token);
        account(data.account);
      },

      getAuthorizationToken: function() {
        return authorizationToken();
      },

      getAccount: function() {
        return account();
      },

      isAuthenticated: function() {
        return authorizationToken() ? true : false;
      },

      isAuthorized: function(authorizedRoles) {
        if (authorizedRoles === null) {
          // if there is not defined rules for this page, is autorized
          return true;
        } else {
          if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
          }

          if (!this.isAuthenticated()) {
            return authorizedRoles.indexOf('guest') !== -1;
          } else {

            return (authorizedRoles.indexOf(
                this.getAccount().role) !== -1 ||
              authorizedRoles.indexOf('*') !== -1);
          }
        }
      },

      destroy: function() {
        authorizationToken(null);
        account(null);
      }
    };

  });