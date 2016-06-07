(function () {
  angular.module('starter')
    .controller('CallController', ['localStorageService', '$scope', '$ionicPopup', 'toaster',
      '$ionicPlatform', '$ionicHistory', CallController]);

  function CallController(localStorageService, $scope, $ionicPopup, toaster, $ionicPlatform, $ionicHistory) {

    var self = this;

    $ionicPlatform.onHardwareBackButton(function () {
      if ($scope.call.open) {
        $scope.call.close();
      }
      $scope.peer.destroy();
    });

    $scope.username = localStorageService.get('username');


    $scope.peer = new Peer($scope.username, {
      host: '192.168.43.144', port: 3000, path: '/peerjs',
      config: {
        'iceServers': [
          {url: 'stun:stun1.l.google.com:19302'},
          {url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com'}
        ]
      }
    });

    $scope.peer.on('open', function (id) {
      console.log('connected:' + id);
      toaster.success("Bienvenido", id, 2000);
    });

    $scope.peer.on('error', function (err) {
      switch (err.type) {
        case 'network':
        {
          if (!$scope.show) {
            toaster.error('Error de conexión');
            $ionicHistory.goBack();
          }
          break;
        }
        case 'unavailable-id':
        {
          $scope.show = true;
          toaster.error('El usuario ' + $scope.username + ' no esta disponible', 'Intente con otro');
          $ionicHistory.goBack();
          break;
        }
        default:
        {
          toaster.error('Se ha producido un error inesperado');
          $ionicHistory.goBack();
        }
      }
    });

    function getVideo(successCallback, errorCallback) {
      navigator.webkitGetUserMedia({audio: true, video: true}, successCallback, errorCallback);
    }

    function onReceiveStream(stream) {
      var video = document.getElementById('contact-video');
      video.src = window.URL.createObjectURL(stream);
      video.onloadedmetadata = function () {
        toaster.success('La llamada ha comenzado!!');
      };
    }

    $scope.endCall = function () {
      if ($scope.call && $scope.call.open) {
        $scope.closing = true;
        $scope.call.close();
      }
    };

    $scope.startCall = function () {
      var contact = self.contact;

      if (contact === undefined || contact === '') {
        return $ionicPopup.alert({
          title: 'Error',
          template: 'Debe ingresar un usuario'
        });
      }

      getVideo(
        function (MediaStream) {
          $scope.call = $scope.peer.call(contact, MediaStream);
          $scope.call.on('stream', onReceiveStream);
          $scope.call.on('close', function () {
            if ($scope.closing) {
              $scope.closing = false;
              toaster.success("Llamada terminada", null, 2000);
            } else {
              toaster.error("Llamada terminada", null, 2000);
            }
          });
        },
        function (err) {
          $ionicPopup.alert({
            title: 'Error',
            template: 'Se ha producido un error al intentar conectar con el micrófono y la cámara del dispositivo'
          });
        }
      );

    };

    $scope.peer.on('call', onReceiveCall);


    function onReceiveCall(call) {
      $scope.call = call;

      /*var alert = $ionicPopup.confirm({
       title: 'Llamada entrante',
       template: '¿Contestar?'
       });

       alert.then(function (res) {
       if (res) {*/
      getVideo(
        function (MediaStream) {
          $scope.call.answer(MediaStream);
        },
        function (err) {
          $ionicPopup.alert({
            title: 'Error',
            template: 'Se ha producido un error al intentar conectar con el micrófono y la cámara del dispositivo'
          });
        }
      );
      $scope.call.on('stream', onReceiveStream);
      $scope.call.on('close', function () {
        if ($scope.closing) {
          $scope.closing = false;
          toaster.success("Llamada terminada", null, 2000);
        } else {
          toaster.error("Llamada terminada", null, 2000);
        }
      });
      /*} else {
       call.close();
       }
       /*});*/

    }

  }

})();
