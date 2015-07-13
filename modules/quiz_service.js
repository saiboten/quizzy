
var mongojs = require("mongojs");
var user_service = require("./user_service");

var db = mongojs('quizzy', ["users"]);
var guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4();
}

var get_current_quiz_name = function(req) {
    return req.session.quizid;
};

var set_current_quiz_name = function(req,quiz) {
    req.session.quizid = quiz;
};

var add_quiz = function(req, quiz, callback) {
    console.log("Adding quiz: ", quiz);

    db.users.findOne({username : user_service.get_username(req)}, function(err, storeduser) {
        console.log("Adding quiz for User: ", storeduser);
        console.log("Error: ", storeduser);

        if(storeduser == undefined) {
            console.log("User does not exist, must create new user before adding question");
            storeduser = {};
            storeduser.username = user_service.get_username(req);
            storeduser.quiz = [];
        }

        if(storeduser.quiz.filter(function(elem) {
            return elem.quiz == quiz
        }).length > 0) {
            console.log("Quiz already exists");
            callback(false, "Quiz already exists");
        }

        storeduser.quiz.push({id: guid(), quiz:quiz, categories: []});

        db.users.save(storeduser, function(err, user_updated) {
            console.log("err: ", err);
            console.log("Quiz created, user after quiz created: ", user_updated);
            callback(true, "");
        });
    });
};


var get_current_quiz = function(req, callback) {
    console.log("Getting quiz for user: ", user_service.get_username(req));
    db.users.findOne({username: user_service.get_username(req)},function(err,user) {
        console.log("Found user: ", user);
        if(user != null) {
            user.quiz.forEach(function(thequiz) {
                if(thequiz.id === get_current_quiz_name(req)) {
                    console.log("Found the real quiz: ", thequiz);
                    callback(thequiz);
                }
            });
        }
    });
};

var get_quizzes = function(req,callback) {
    console.log("Getting quizzes for user: ", user_service.get_username(req));
    db.users.findOne({username: user_service.get_username(req)},function(err,user) {
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

