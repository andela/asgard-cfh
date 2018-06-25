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
  function ($scope, Global, $http, $window, $location, $q, socket, game, AvatarService) {
    $scope.global = Global;

    $scope.playAsGuest = function () {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showLoginError = false;
    $scope.hasSignupError = false;
    $scope.SignupError = null;
    $scope.loginError = null;
    $scope.dontShow = false;
    $scope.avatars = [];
    let userId = null;
    if (window.user) {
      userId = window.user._id;
    }
    $scope.user = {};

    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });

    if (window.user) {
      $window.onload = $http.get(`/api/profile/${userId}`)
        .then((res) => {
          $scope.user = res.data;
        });
    } else if ($location.path === '/profile') {
      $location.path('/');
    }

    $scope.image = '';
    $scope.image_preview = '';
    $scope.readImage = () => {
      const file = event.target.files[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (event) {
          $scope.image_preview = event.target.result;
          $scope.image = file;
        };
      }
    };

    $scope.signUp = function () {
      if ($scope.image) {
        var imageData = new FormData();
        imageData.append('file', $scope.image);
        imageData.append('upload_preset', 'zyu1ajoa');
        imageData.append('api_key', '126852175969548');
        $.ajax({
          url: 'https://api.cloudinary.com/v1_1/clintfidel/image/upload',
          data: imageData,
          method: 'POST',
          contentType: false,
          processData: false,
          success(res) {
            $scope.user.profileImage = res.secure_url;
            $http.post('/api/auth/signup', $scope.user)
              .then(() => {
                $('#signUpModal').modal('show');
              }, (error) => {
                if (error.data.errors) {
                  $scope.hasSignupError = true;
                  $scope.signupError = error.data.errors[0].msg || error.data.msg;
                }
              });
          }
        });
      } else {
        $http.post('/api/auth/signup', $scope.user)
          .then(
            () => {
              $('#signUpModal').modal('show');
            },
            (error) => {
              if (error.data.errors) {
                $scope.hasSignupError = true;
                $scope.signupError = error.data.errors[0].msg || error.data.message;
              }
              if (error.data.message) {
                $scope.hasSignupError = true;
                $scope.signupError = error.data.message;
              }
            }
          );
      }
    };

    $scope.login = function () {
      $http.post('/api/auth/login', $scope.user)
        .then((response) => {
          localStorage.setItem('token', response.data.token);
          $http.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
          $location.path('/');
        }, (error) => {
          $scope.showLoginError = true;
          $scope.loginError = error.data.message;
        });
    };

    $scope.logout = function () {
      $http.get('/signout')
        .then(() => {
          localStorage.removeItem('token');
          $location.path('/#!');
        });
    };
    $scope.openDropdown = () => {
      $('.dropdown-toggle').dropdown();
    };

    $scope.acceptFriendInvites = function (user) {
      const token = localStorage.token;

      $http({
        method: 'POST',
        url: '/api/accept-friend-invite',
        data: {
          acceptEmail: user.senderEmail,
          acceptName: user.senderName,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }).then(
        (response) => {
          toastr.success('Friend Invitation accepted successfully');
        },
        (error) => {
          toastr.error('Error: Could not add friend');
        }
      );
    };

    $scope.rejectFriendInvites = function (user) {
      const token = localStorage.token;

      $http({
        method: 'POST',
        url: '/api/reject-friend-invite',
        data: {
          rejectEmail: user.senderEmail,
          rejectName: user.senderName,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`
        }
      }).then(
        (response) => {
          toastr.success('Friend Invitation accepted successfully');
        },
        (error) => {
          toastr.error('Error: Could not reject friend');
        }
      );
    };
  }]);
