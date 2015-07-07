
var mongojs = require("mongojs");
var user_service = require("./user_service");
var current_quiz = undefined;

var db = mongojs('quizzy', ["users"]);

var get_current_quiz_name = function() {
    return current_quiz;
};

var set_current_quiz_name = function(quiz) {
    current_quiz = quiz;
};

var add_quiz = function(quiz) {
    console.log("Adding quiz: ", quiz);

    db.users.findOne({username : user_service.get_username()}, function(err, storeduser) {
        console.log("Adding quiz for User: ", storeduser);
        console.log("Error: ", storeduser);

        if(storeduser == undefined) {
            console.log("User does not exist, must create new user before adding question");
            storeduser = {};
            storeduser.username = user_service.get_username();
            storeduser.quiz = [];
        }

        storeduser.quiz.push({quiz:quiz, categories: {}});

        db.users.save(storeduser, function(err, user_updated) {
            console.log("err: ", err);
            console.log("Quiz created, user after quiz created: ", user_updated);
        });
    });
};


var get_current_quiz = function(callback) {
    console.log("Getting quiz for user: ", user_service.get_username());
    db.users.findOne({username: user_service.get_username()},function(err,user) {
        console.log("Found user: ", user);
        if(user != null) {
            user.quiz.forEach(function(thequiz) {
                if(thequiz.quiz === get_current_quiz_name()) {
                    console.log("Found the real quiz: ", thequiz);
                    callback(thequiz);
                }
            });
        }
    });
};

var get_quizzes = function(callback) {
    console.log("Getting quizzes for user: ", user_service.get_username());
    db.users.findOne({username: user_service.get_username()},function(err,user) {
        console.log("Found data: ", err, user);
        if(user != null) {
            callback(user.quiz);
        }
        else{
            console.log("User does not exist yet. Returning empty list");
            callback([]);
        }
    });
};

exports.get_quizzes = get_quizzes;
exports.add_quiz = add_quiz;
exports.get_current_quiz_name = get_current_quiz_name;
exports.set_current_quiz_name = set_current_quiz_name;
exports.get_current_quiz = get_current_quiz;

