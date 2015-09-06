angular.module("demoApp")
  .controller("appController", function($scope, $rootScope, $state,
    AUTH, DEFAULT_STATE, Session, AuthenticationService) {
    $scope.isLogged = false;
    $scope.appName='Demo App';
    $rootScope.$on(AUTH.loginSuccessEvent, function(event, userInfo) {
      console.log('User has been authenticated');
      $scope.currentUser = userInfo.name;
      navigateToDefault();
    });

    function navigateToDefault() {
      $state.go(DEFAULT_STATE);
    }

     $rootScope.$on(
      '$stateChangeSuccess', function() {
        if(Session.isAuthenticated()) {
          $scope.currentUser = Session.getAccount();
        }
      });

    $scope.logout = function() {
      AuthenticationService.logout();
      $rootScope.$emit(AUTH.logoutSuccessEvent);
    };

    $rootScope.$on(AUTH.logoutSuccessEvent, function() {
      console.log('Log out success');
      $scope.currentUser = null;
      $state.go('login');
    });

  });