var privateBowerApp = angular.module('privateBower', [
	//project modules
	'privateBowerControllers',
    'privateBowerServices',
	
	//ng modules
	'ngAnimate',
	
	//3rd party modules
    'ui.bootstrap' // for the modal - could pull modal source specifically
]);

privateBowerApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('addedPackage', function(){
        $rootScope.$broadcast('updatePackages');
    });
    $rootScope.$on('removedPackage', function(){
        $rootScope.$broadcast('updatePackages');
    });
}]);

var privateBowerControllers = angular.module('privateBowerControllers', []);

privateBowerControllers.controller('mainController', ['$scope', '$modal', 'packageService', function($scope, $modal, packageService) {

    getPackages();

    $scope.selectPackage = function(){
      $modal.open({
          templateUrl: 'partials/_selectPackage.html',
          controller: 'selectPackageController'
      });
    };

    $scope.removePackage = function(bowerPackage){
        packageService.removePackage(bowerPackage.name)
          .then(function success(){
              $scope.$emit('removedPackage');
          }, function error(){
              //TODO error messages
              console.log('an error has occurred');
          })

    };

    $scope.$on('updatePackages', getPackages);

    function getPackages(){
        packageService.getPackages()
            .then(function success(packages) {
                $scope.packages = packages;
            },
            function error() {
                $scope.error = true;
            });
    }
}]);

privateBowerControllers.controller('selectPackageController', ['$scope', 'packageService', function($scope, packageService) {
    $scope.addPackage = function(){
        var repoName = $scope.repoName,
            repoPath  = $scope.repoPath;
        if(repoName === undefined || repoPath === undefined){
            console.log('please enter a name and url');
            //TODO validation?
        } else {
            packageService.addPackage(repoName, repoPath)
                .then(function success(){
                    $scope.$emit('addedPackage');
                    $scope.$close();
                },
                function error(err){
                    console.log('something went wrong');
                    //TODO add error message?
                });
        }
    };

    $scope.close = function(){
        $scope.$close();
    };
}]);

var privateBowerServices = angular.module('privateBowerServices', []);

privateBowerServices.factory('packageService', ['$http', '$q', function($http, $q){

    return {
        addPackage: function(repoName, repoPath){
            return post('registerPackage', {
                name: repoName,
                repo: repoPath
            });
        },
        getPackages: function(){
            return get('packages');
        },
        removePackage: function(packageName){
            return post('removePackage', {
                name: packageName
            });
        }
    };

    function post(url, data){
        var deferred = $q.defer();
        $http.post(url, data)
            .success(deferred.resolve)
            .error(deferred.reject);
        return deferred.promise;
    }

    function get(url){
        var deferred = $q.defer();
        $http.get(url)
            .success(deferred.resolve)
            .error(deferred.reject);
        return deferred.promise;
    }

}]);
