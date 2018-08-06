"use strict";

var clicker = {};

$(function() {
    var currQuestionId = null

    function init() {
	if (common.getUrlParameter('admin') != '1') {
	    $(".admin_content").hide()
	}
    }
    
    clicker.clickerSubmit = function(answer) {
	var data = {
	    "fn": "answer",
	    "question_id": currQuestionId,
	    "answer": answer
	}
	common.callLambda(data, function(data) {
	    console.log("answer uploaded")
	})
    };

    clicker.clickerSummarizeAnswers = function() {
	var data = {
	    "fn": "get_answer_counts",
	}
	common.callLambda(data, function(data) {
	    // log errors
	    if (data.body.errors.length > 0) {
		console.log("Errors:")
		console.log(data.body.errors)
	    }

	    // display answers, if any
	    var answers = data.body.answers
	    if(Object.keys(answers).length == 0) {
		$("#answers").val("no answers yet")
		return
	    }
	    
	    var total = 0
	    for(var k in answers) {
		total += answers[k]
	    }

	    var text = ""
	    Object.keys(answers).sort().forEach(function(k){
		var count = answers[k]
		text += (k + ": " + count + " (" + Math.round(count*100/total) + "%)\n")
	    })
	    $("#answers").val(text)
	})
    };

    clicker.clickerRefreshQuestion = function() {
	var data = {
	    "fn": "get_question"
	}
	common.callLambda(data, function(data) {
	    $("#question").val(data.body.question)
	    currQuestionId = data.body.id
	})
    };

    clicker.clickerUploadQuestion = function() {
	console.log($("#question").val())
	var data = {
	    "fn": "put_question",
	    "question": $("#question").val()
	}

	common.callLambda(data, function(data) {
	    console.log("question uploaded")
	})
    };

    init()
})
