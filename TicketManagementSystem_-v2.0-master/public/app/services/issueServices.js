
var app=angular.module('issueServices',[])

app.factory('Issue',function($http){
    issueFactory = {};

    issueFactory.create = function(issueData){
       return  $http.post('/api/createIssue',issueData);
    };
    
    return issueFactory;
});