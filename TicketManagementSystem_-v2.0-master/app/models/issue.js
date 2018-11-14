var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var titlize  = require('mongoose-title-case');

var Schema   = mongoose.Schema;

var textValidator = [
    validate({
        validator : 'isAlpha',
        //arguments : /^[a-zA-Z]$/,
        message   : "Mantis Status,MantisnCategory,Mantis Priority,Internal Status,Internal Category,Internal Priority,Module & Assing to fields should contain only alphabets."
    }),
    validate({
        validator : 'isLength',
        arguments : [3,20],
        message   : "Length should be in between {ARGS[0]} and {ARGS[1]} characters for all Text Fields"
    }),
  ]

  var issueIDValidator = [
    validate({
        validator : 'isNumeric',
        message   : "Issue ID field should have only numbers."
    }),
    validate({
        validator : 'isLength',
        arguments : [1,8],
        message   : "Length should be in between {ARGS[0]} and {ARGS[1]} characters for Issue ID Field."
    }),
  ]

  var associateIDValidator = [
    validate({
        validator : 'isNumeric',
        message   : "Assign To Field should have only numbers."
    }),
    validate({
        validator : 'isLength',
        arguments : [6],
        message   : "Length should be {ARGS[0]} characters for Assign To Field."
    }),
  ]

var issueSchema = new Schema({
    mantisIssueID    : {type:String, required:true, unique:true,validate:issueIDValidator},
    mantisStatus     : {type:String, required:true, validate:textValidator},
    mantisCategory   : {type:String, required:true, validate:textValidator},
    mantisPriority   : {type:String, required:true, validate:textValidator},
    internalStatus   : {type:String, required:true, validate:textValidator},
    internalCategory : {type:String, required:true, validate:textValidator},
    internalPriority : {type:String, required:true, validate:textValidator},
    module           : {type:String, required:true, validate:textValidator},
    assingedTo       : {type:String, required:true, validate:associateIDValidator}
});

module.exports = mongoose.model('Issue',issueSchema);

