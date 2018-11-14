

var application = angular.module('ticketManagement',['appRoutes','userController','userServices','ngAnimate','mainController','authServices','managementController','issueController','issueServices'])


.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptors');
});