var User     = require('../models/user');
var Issue     = require('../models/issue');
var jwt      = require('jsonwebtoken');
var secret   = 'tic@M@n@geR';

module.exports = function(router) {
        // Middleware which will check the users session
	router.use(function (req,res,next) {
		var token = req.body.token || req.body.query || req.headers['x-access-token'];
		if(token){
			// verify a token symmetric
			jwt.verify(token, secret, function(err, decoded) {
				if(err) {
					res.json({success:false,message:'Invalid token. Do login again!'});
				}else{
					req.decoded = decoded;
					next();
				}
			});

		}
		else{
			res.json({success:false,message:'No Token Provided'});
		}
	});


    router.post('/createIssue',function (req,res) {
        User.findOne({ associateID : req.decoded.associateID }).select('permission').exec(function (err,mainUser) {
            if(err){
                res.json({success:false,message:err});
            }else{
               if(mainUser.permission != "admin" && mainUser.permission != "moderator"){
                    res.json({success:false,message:"Insufficient Permission"});
               }else{
                    var issue = new Issue();
                    issue.mantisIssueID =  req.body.mantisIssueID;
                    issue.mantisStatus = req.body.mantisStatus;
                    issue.mantisCategory = req.body.mantisCategory;
                    issue.mantisPriority = req.body.mantisPriority;
                    issue.internalStatus = req.body.internalStatus;
                    issue.internalCategory = req.body.internalCategory;
                    issue.internalPriority = req.body.internalPriority;
                    issue.module = req.body.module;
                    issue.assingedTo = req.body.assingedTo;
                    if(issue.mantisIssueID==null || issue.mantisIssueID==""|| issue.mantisStatus==null || issue.mantisStatus=="" || issue.mantisCategory ==null || issue.mantisCategory =="" ||issue.mantisPriority ==null || issue.mantisPriority==""){
                            if(issue.internalStatus==null || issue.internalStatus==""|| issue.internalCategory==null || issue.internalCategory =="" || issue.internalPriority ==null || issue.internalPriority =="" || issue.module ==null || issue.module =="" ||issue.assingedTo == "" ||issue.assingedTo == null){
                                res.json({success:false,message:"Please Ensure all fields are filled with valid Data"});
                            }
                    }else{
                    issue.save(function (err) {

                        if(err){
                            if(err.errors!=null){
                                console.log(err);
                                
                            if(err.errors.mantisIssueID){
                                res.json({success:false,message:err.errors.mantisIssueID.message,field:"mantisIssueID"});
                            }else if(err.errors.mantisStatus){
                                res.json({success:false,message:err.errors.mantisStatus.message,field:"mantisStatus"});
                            }else if(err.errors.mantisCategory){
                                res.json({success:false,message:err.errors.mantisCategory.message,field:"mantisCategory"});
                            }else if(err.errors.mantisPriority){
                                res.json({success:false,message:err.errors.mantisPriority.message,field:"mantisPriority"});
                            }else if(err.errors.internalStatus){
                                res.json({success:false,message:err.errors.internalStatus.message,field:"internalStatus"});
                            }else if(err.errors.internalCategory){
                                res.json({success:false,message:err.errors.internalCategory.message,field:"internalCategory"});
                            }else if(err.errors.internalPriority){
                                res.json({success:false,message:err.errors.internalPriority.message,field:"internalPriority"});
                            }else if(err.errors.module){
                                res.json({success:false,message:err.errors.module.message,field:"module"});
                            }else if(err.errors.assingedTo){
                                res.json({success:false,message:err.errors.assingedTo.message,field:"assingedTo"});
                            }else{
                                res.json({success:false,message:err});
                            }
                        }else if(err){
                            if(err.code == 11000){
                                    res.json({success:false,message:"Issue ID already exists."});
                                }
                            }else{
                                res.json({success:false,message:err});
                            }
                        }else{
                                res.json({success:true,message:"Issue has been added successfully"});
                        }
                        }); 
                    }
               }
            }
        });
    });


    return router;
}