
var app=angular.module('myTicketService',['ui.bootstrap','datatables','ngMaterial', 'ngMessages'])

app.factory('Ticket',function($http){
    ticketFactory = {};

    ticketFactory.getAllTickets = function(){
        return  $http.get('/api/myTickets');
   };

   ticketFactory.getSearchResults = function(searchObject){
        console.log(searchObject);
        return  $http.post('/api/filterSearch',searchObject);
    };

     return ticketFactory;
});


