angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.route', 'ngSanitize', 'ngRoute', 'firebase', 'mean.system', 'mean.directives']) //eslint-disable-line
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/index.html',
        })
        .when('/confirmaccount', {
          templateUrl: '/views/activateEmail.html',
        })
        .when('/activationComplete', {
          templateUrl: '/views/activateComplete.html',
        })
        .when('/app', {
          templateUrl: '/views/app.html',
        })
        .when('/dashboard', {
          templateUrl: '/views/dashboard.html'
        })
        .when('/privacy', {
          templateUrl: '/views/privacy.html',
        })
        .when('/bottom', {
          templateUrl: '/views/bottom.html'
        })
        .when('/signin', {
          templateUrl: '/views/signin.html'
        })
        .when('/profile', {
          templateUrl: '/views/userProfile.html'
        })
        .when('/signup', {
          templateUrl: '/views/signup.html'
        })
        .when('/choose-avatar', {
          templateUrl: '/views/choose-avatar.html'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  ]).config(['$locationProvider',
    function ($locationProvider) {
      $locationProvider.hashPrefix('!');
    }
  ]).run(['$rootScope', function ($rootScope) {
    $rootScope.safeApply = function (fn) {
      const phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  }])
  .run(['DonationService', function (DonationService) {
    window.userDonationCb = function (donationObject) {
      DonationService.userDonated(donationObject);
    };
  }]);

angular.module('mean.system', []);
angular.module('mean.directives', []);
