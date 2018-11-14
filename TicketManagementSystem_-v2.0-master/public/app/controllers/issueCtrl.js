var app = angular.module('issueController',['issueServices'])

app.controller('issueCtrl', function ($http,$location,$timeout,Issue,$scope) {
    var appData=this;
    appData.Categories = ["Issue", "Support Request", "Enhancment Request"];
    appData.mantisStatus = ["New", "Assigned", "Confirmed", "Feedback","Resolved","Closed"];
    appData.internalStatus = ["Assigned", "Confirmed", "Waiting For Feedback","Resolved","Closed"];

    this.createIssue = function(issueData){
        appData.loading=true;
        appData.errorMsg= false;
        appData.successMsg= false;
        //if(valid){
            Issue.create(appData.issueData).then(function(data){  
                if(data.data.success){
                    appData.loading=false;
                    appData.successMsg = data.data.message;
                    appData.field = data.data.field;
                }else{
                    appData.loading=false;
                    appData.errorMsg = data.data.message;
                }
            });
        //}else{
        //    appData.loading=false;
        //}
    }

});