var app = angular.module('myTicketsController',['myTicketService'])

app.controller('myTicketsCtrl', function ($http,$location,$timeout,Ticket,$scope,Issue,User,DTOptionsBuilder, DTColumnBuilder,DTColumnDefBuilder,$compile,$mdDialog ) {

    var appData=this;
    appData.Categories = ["Issue", "Support Request", "Enhancement Request"];
    appData.mantisStatus = ["New", "Assigned", "Confirmed", "Feedback","Resolved","Closed"];
    appData.priorities = ["Low", "Normal", "High","Immediate"];
    appData.internalStatus = ["Assigned", "New", "Waiting For Feedback","Waiting for Review","Resolved","Closed"];

    appData.getTickets = function(){
        Ticket.getAllTickets().then(function(data){
            console.log(data);
            appData.tickets =  data.data.tickets;
            //$scope.tickets = data.data.tickets;
        });  
    };

    appData.getTickets();

    var arr = new Array();

    appData.getAllUsers = function (){
        User.getAllUsers().then(function (data) {
            if(data.data.success){
                
                    appData.users =  data.data.users;
                    //console.log(appData.users);
                    appData.loading = false;
                    appData.accessDenied = false;
                    angular.forEach(appData.users, function (users) {
                        arr.push({ userName: users.userName, associateID:users.associateID});
                    });
                    //console.log(arr);
                    $scope.usersList = arr; 
            }else{
                appData.errorMsg = data.data.message;
                appData.loading = false;
            }
        });

    }

    appData.getTicketSummaryByModule = function(){
        Issue.getTicketSummaryByModule().then(function(data){
            appData.TicketSummary =  data.data.TicketSummary;
            appData.moduleList = [];
            for(i=0;i<appData.TicketSummary.length;i++){
                   if ((appData.moduleList.indexOf(appData.TicketSummary[i]._id))<0){
                    appData.moduleList.push(appData.TicketSummary[i]._id);    
                }
            }
            appData.moduleList.sort();       
            console.log(appData.moduleList);
        });        
    };

    appData.getAllUsers();
    appData.getTicketSummaryByModule();
    appData.repos = arr;

    $scope.vm = {};
    $scope.vm.dtInstance = {};   
    $scope.vm.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(2).notSortable()];
    $scope.vm.dtOptions = DTOptionsBuilder.newOptions()
				  .withOption('paging', true)
                  .withOption('searching', true)
                  .withOption('responsive', true)
                  .withOption('info', true)
                  .withButtons([
                    {
                        extend:    'copy',
                        text:      '<i class="fa fa-files-o"></i> Copy',
                        titleAttr: 'Copy'
                    },
                    {
                        extend:    'print',
                        text:      '<i class="fa fa-print" aria-hidden="true"></i> Print',
                        titleAttr: 'Print'
                    },
                    {
                        extend:    'excel',
                        text:      '<i class="fa fa-file-text-o"></i> Excel',
                       titleAttr: 'Excel'
                    },
                ]
              );

    /*Changes Done For Comments */

    $scope.showCommentDisplay = function(id){
        //console.log(id);
        Issue.getAllComments(id).then(function (data) {
            //console.log(data);
            $scope.comments = data.data.comments;
            $scope.showCommentPopup();
        });
    };

    $scope.showCommentPopup = function(ev) {
        //console.log(ev);
        $mdDialog.show({
          controller: dialogContentController,
          controllerAs: 'dialogCtrl',
          templateUrl: 'app/views/pages/toast/commentDialog.html',
            locals: {
                dataItems: $scope.comments
            },
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };

      

      function dialogContentController($scope,$mdDialog, dataItems) {
        var dialogCtrl = this;
    
        dialogCtrl.comments = dataItems;

        $scope.hide = function() {
            $mdDialog.hide();
        };

      }


      appData.selectedItem = null;
      appData.selectedItemInternal = null;
      appData.selectedItemExternal = null;
      appData.selectedModule = null;
      appData.selectedItemInternalPriority = null;
      appData.searchText = null;
      appData.selectedUsers = null;
      appData.selectedItemExternalPriority = null;
      appData.selectedItemInternalCategory = null;
      
      

      appData.selectedMantisStatusChip = [];
      appData.selectedInternalStatusChip = [];
      appData.selectedExternalCategoryChip = [];
      appData.moduleChip = [];
      appData.assignToChip = [];
      appData.selectedInternalPriorityChip = [];
      appData.selectedExternalPriorityChip = [];
      appData.selectedInternalCategoryChip = [];
      
      
      appData.autocompleteDemoRequireMatch = true;
      appData.autocompleteDemoRequireMatchInternal = true;
      appData.autocompleteDemoRequireMatchExternal = true;
      appData.autocompleteModule = true;
      appData.autocompleteAssignTo = true;
      appData.autocompleteInternalPriority = true;
      appData.autocompleteExternalPriority = true;
      appData.autocompleteInternalCategory = true;

      /*Changes Done For Comments */

      $scope.showSearchResults = function(showData){
        resultObject = {};
        appData.associateIDData = [];
        appData.ticketData = [];
        console.log(appData.selectedMantisStatusChip);
        //for(i=0;i<appData.length;i++){
            if(appData.selectedMantisStatusChip!=""){
                resultObject.selectedMantisStatusChip = appData.selectedMantisStatusChip;
            }else{
                resultObject.selectedMantisStatusChip = ["New", "Assigned", "Confirmed", "Feedback","Resolved","Closed"];
            }

            if(appData.selectedInternalStatusChip!=""){
                resultObject.selectedInternalStatusChip = appData.selectedInternalStatusChip;
            }else{
                resultObject.selectedInternalStatusChip = ["Assigned", "New", "Waiting For Feedback","Waiting for Review","Resolved","Closed"];
            }

            if(appData.selectedExternalCategoryChip!=""){
                resultObject.selectedExternalCategoryChip = appData.selectedExternalCategoryChip;
            }else{
                resultObject.selectedExternalCategoryChip = ["Issue", "Support Request", "Enhancement Request"];
            }

            if(appData.selectedInternalCategoryChip!=""){
                resultObject.selectedInternalCategoryChip = appData.selectedInternalCategoryChip;
            }else{
                resultObject.selectedInternalCategoryChip = ["Issue", "Support Request", "Enhancement Request"];
            }

            if(appData.selectedExternalPriorityChip!=""){
                resultObject.selectedExternalPriorityChip = appData.selectedExternalPriorityChip;
            }else{
                resultObject.selectedExternalPriorityChip = ["Low", "Normal", "High","Immediate"];
            }

            if(appData.selectedInternalPriorityChip!=""){
                resultObject.selectedInternalPriorityChip = appData.selectedInternalPriorityChip;
            }else{
                resultObject.selectedInternalPriorityChip = ["Low", "Normal", "High","Immediate"];
            }

            if(appData.moduleChip!=""){
                resultObject.moduleChip = appData.moduleChip;
            }else{
                resultObject.moduleChip = appData.moduleList;
            }

            if(appData.assignToChip!=""){
                resultObject.assignToChip = appData.assignToChip;
                for(i=0;i<appData.assignToChip.length;i++){
                    //console.log(appData.assignToChip[i].associateID);
                    appData.ticketData.push(appData.assignToChip[i].associateID);
                }
                //console.log(appData.ticketData);
                resultObject.assignToChip = appData.ticketData;
            }else{
                var associateValue = appData.repos;
                for(i=0;i<associateValue.length;i++){
                    appData.associateIDData = associateValue[i].associateID;
                    //console.log(appData.associateIDData);
                    appData.ticketData.push(appData.associateIDData);
                }
                //console.log(appData.ticketData);
                resultObject.assignToChip = appData.ticketData;
            }
            
            Ticket.getSearchResults(resultObject).then(function (data) {
                //console.log(data.data.searchResult);
                appData.tickets = data.data.searchResult;
            });
    }

});