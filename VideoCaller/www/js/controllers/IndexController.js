(function () {
  angular.module('starter')
    .controller('IndexController', ['localStorageService', '$scope', '$state', '$ionicPopup', IndexController]);

  function IndexController(localStorageService, $scope, $state, $ionicPopup) {

    $scope.login = function () {
      var username = $scope.username;
      if (username === undefined || username === '') {
        return $ionicPopup.alert({
          title: 'Error',
          template: 'Debe ingresar un usuario'
        });
      }
      localStorageService.set('username', username);
      $state.go('app');
    };
  }

})();
