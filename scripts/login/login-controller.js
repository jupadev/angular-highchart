angular.module('demoApp.login', [])
  .controller('LoginController', function($scope, $rootScope, AuthenticationService,
    storageService, AUTH) {
    $scope.appName = 'Demo App';
    $scope.credentials = {
      username: {
        value: '',
        error: ''
      },
      password: {
        value: '',
        error: ''
      },
      valid: true,
      unknownError: false
    };
    var errorMessages = {
      username: {
        required: 'Username is required'
      },
      password: {
        required: 'Password is required'
      }
    };
    $scope.isLoading = false;
    $scope.onLogin = function(credentials) {
      var loginresult = null;
      if (validate(credentials)) {
        $scope.isLoading = true;
        AuthenticationService.login(credentials.username.value, credentials.password.value)
          .then(function(data) {
            if (data.token) {
              credentials.unknownError = false;
              credentials.valid = true;
              $rootScope.$emit(AUTH.loginSuccessEvent, data);
            } else {
              credentials.valid = false;
              credentials.password = '';
            }
          })
          .catch(function() {
            credentials.unknownError = true;
          })
          .finally(function(){
            $scope.isLoading = false;
          });
      }
    };


    function validate(credentials) {
      var input,
        error,
        result = true;
      $scope.credentials.username.error = '';
      $scope.credentials.password.error = '';
      if (!$scope.loginForm.$valid) {
        for (input in errorMessages) {
          if ($scope.loginForm[input] && $scope.loginForm[input].$invalid) {
            for (error in $scope.loginForm[input].$error) {
              if ($scope.loginForm[input].$error[error]) {
                $scope.loginForm[input].$dirty = true;
                $scope.credentials[input].error = errorMessages[input][error];
                $scope.credentials.password.value = '';
                if (input !== 'password') {
                  $scope.loginForm.password.$setPristine();
                }
                result = false;
              }
            }
          }
        }
      }
      return result;
    }

  });