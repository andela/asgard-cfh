/* eslint-disable */
var app = angular.module('mean.system')

app.filter('highlight', ['$sce', function ($sce) {
    return function (text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span class="highlighted">$1</span>')
        return $sce.trustAsHtml(text)
    }
}]);

app.controller('searchController', function($scope, $http) {
      $scope.foundUsers = [];
      $scope.invite = {};
      $scope.link = window.location.href;
$scope.findUsers = function(){
    $http.post('/search', {term: $scope.inputValue})
    .then((response) => {
        $scope.foundUsers = response.data.foundUser;
        $scope.userNotFound = false;
    }, (error) => {
        $scope.userNotFound = true;
        $scope.foundUsers = null;
    });
}
$scope.sendInvites = function(user){
    $scope.invite.recieverEmail = user.email;
    $scope.invite.gameURL = $scope.link;
    const token = localStorage.token;
    console.log(token);
    console.log($scope.invite);

    $http({
        method: 'POST',
        url: '/invite',
        data: { recieverEmail: user.email,
                gameURL: $scope.link, },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        }
    }).then((response) => {
        toastr.success('Invitation sent successfully')
    },
    (error) => {
        toastr.error('Error: invite not sent');
    });
} 
});