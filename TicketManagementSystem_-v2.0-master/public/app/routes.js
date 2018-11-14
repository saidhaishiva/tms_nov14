var app = angular.module('appRoutes',['ngRoute']);

app.config(function($routeProvider, $locationProvider){

    $routeProvider
    .when('/',{
        templateUrl:'app/views/pages/home.html'
    })
    .when('/dashboard',{   
        templateUrl:'app/views/pages/dashboard.html'
    })
    .when('/register',{   
        templateUrl: 'app/views/pages/users/registration.html',
        controller: 'registrationCtrl',
        controllerAs:  'regCtrl'
    })
    .when('/login',{   
        templateUrl: 'app/views/pages/users/login.html'
    })
    .when('/profile',{   
        templateUrl: 'app/views/pages/users/profile.html'
    })
    .when('/regSuccess',{   
        templateUrl: 'app/views/pages/users/regSuccess.html'
    })
    .when('/management',{   
        templateUrl : 'app/views/pages/management/management.html',
        controller  : 'managementCtrl',
        controllerAs:  'management',
        
    })
    .when('/edit/:id',{   
        templateUrl : 'app/views/pages/management/edit.html',
        controller  : 'editCtrl',
        controllerAs: 'edit',
        
    })
    .when('/addAnIssue',{   
        templateUrl : 'app/views/pages/management/createIssue.html',
        controller  : 'issueCtrl',
        controllerAs:  'issue',
    })
    .otherwise({
        redirectTo:'/'
    })
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

// Run a check on each route to see if user is logged in or not (depending on if it is specified in the individual route)
app.run(['$rootScope', 'Auth', '$location', 'User', function($rootScope, Auth, $location, User) {
    // Check each time route changes    
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        var url = $location.path();
        if(url=="/management" || url.includes("edit")|| url=="/addAnIssue"){
            permission  = ['admin','moderator'];
        }
        // Only perform if user visited a route listed above
        if (next.$$route !== undefined) {
            // Check if authentication is required on route
            if ((url=="/profile"||url=="/management"||url=="/logout"||url=="/addAnIssue")) {
                // Check if authentication is required, then if permission is required
                if (!Auth.isLoggedIn()) {
                    event.preventDefault(); // If not logged in, prevent accessing route
                    $location.path('/'); // Redirect to home instead
                } else if (permission) {
                    // Function: Get current user's permission to see if authorized on route
                    User.getPermission().then(function(data) {
                        // Check if user's permission matches at least one in the array
                        if(permission[0] !== data.data.permission && permission[1] !== data.data.permission){
                            event.preventDefault(); // If not logged in, prevent accessing route
                            $location.path('/'); // Redirect to home instead
                        }
                    });
                }
            } else if ((url=="/register"||url=="/login"||url=="/regSuccess")) {
                // If authentication is not required, make sure is not logged in
                if (Auth.isLoggedIn()) {
                    event.preventDefault(); // If user is logged in, prevent accessing route
                    $location.path('/profile'); // Redirect to profile instead
                }
            }
        }
    });
}]);


