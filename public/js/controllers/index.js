/* eslint-disable */
angular.module('mean.system').controller('IndexController', [
  '$scope',
  'Global',
  '$http',
  '$window',
  '$location',
  '$q',
  'socket',
  'game',
  'AvatarService',
  ($scope, Global, $http, $window, $location, $q, socket, game, AvatarService) => {
    $scope.global = Global;

   $scope.playAsGuest = () => {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showLoginError = false;
    $scope.hasSignupError = false;
    $scope.SignupError = null;
    $scope.loginError = null;
    $scope.dontShow = false;
    $scope.avatars = [];

    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

      $scope.image = '';
      $scope.image_preview = '';
      $scope.readImage = () => {
        const file = event.target.files[0];
        if(file) {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = event => {
            $scope.image_preview = event.target.result
            $scope.image = file
          };
        }
      }

     $scope.signUp = () => {
       if ($scope.image) {
        const imageData = new FormData();
        imageData.append('file', $scope.image);
        imageData.append('upload_preset', 'zyu1ajoa');
        imageData.append('api_key', '126852175969548')
        $.ajax({
          url: "https://api.cloudinary.com/v1_1/clintfidel/image/upload",
          data: imageData,
          method: 'POST',
          contentType: false,
          processData: false,
          success(res){
            $scope.user.profileImage = res.secure_url;
            $http.post('/api/auth/signup', $scope.user)
            .then((response) => {
          $location.path('/confirmaccount');
        }, (error) => {
          if(error.data.errors) {
            $scope.hasSignupError = true;
            $scope.signupError = error.data.errors[0].msg || error.data.msg
          }
        });
          }
        })
       } else {
        $http.post('/api/auth/signup', $scope.user)
        .then((response) => {
          $location.path('/confirmaccount');
        },
        (error) => {
          console.log(error)
            console.log('--->>>>>-----')
          if(error.data.errors) {
            $scope.hasSignupError = true;
            $scope.signupError = error.data.errors[0].msg || error.data.msg
          }
        });
      }
      }

     $scope.login = () => {
      $http.post('/api/auth/login', $scope.user)
      .then((response) => {
        localStorage.setItem('token', response.data.token);
        $http.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
        $location.path('/');
      }, (error) => {
        $scope.showLoginError = true;
        console.log(error.data.message);
        $scope.loginError = error.data.message;
      });
      
    }

    $scope.logout =() => {
      $http.get('/signout')
        .then((res) => {
          localStorage.removeItem('token');
          $location.path('/#!');
        });
    }
}]);
