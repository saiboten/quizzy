
var mongojs = require("mongojs");

var db = mongojs('quizzy', ["questions"]);

var add_question = function(question) {
    console.log("Adding question ?: ", question);

    db.questions.save(question, function() {
        console.log("Callback from save question to mongodb called.");
    });
};

var remove_question = function(question) {
    console.log("Removing question: " + question);

    db.questions.remove({question: question}, function(err, numberOfRemovedDocs) {
        console.log("Questions removed: ", numberOfRemovedDocs);
    });
}

var get_questions = function(callback) {
    console.log("Getting questions", db.questions);
    db.questions.find(function(err,questions) {
        console.log("Found data: ", err, questions);
        callback(questions);
    });
};

exports.add_question = add_question;
exports.get_questions = get_questions;
exports.remove_question = remove_question;