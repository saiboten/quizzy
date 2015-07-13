var mongojs = require("mongojs");
var user_service = require("./user_service");
var quiz_service = require("./quiz_service");
var db = mongojs('quizzy', ["users"]);

var add_category = function(req, category) {
    db.users.findOne({username: user_service.get_username(req)}, function(err, user) {
        for(var i = 0; i<user.quiz.length; i++) {
            var quiz = user.quiz[i];

            if(quiz_service.get_current_quiz_name(req) == quiz.id) {
                console.log("Adding category: ", category);
                user.quiz[i].categories.push({name: category, questions: []});

                console.log("Category service - User: ", user);

                db.users.save(user, function(err, user_updated) {
                    console.log("Category added, user after quiz created: ", user_updated);
                });
            }
        }
    })
};

var get_categories = function(req, callback) {
    db.users.findOne({username: user_service.get_username(req)}, function(err, user) {
        console.log("Getting categories for user: ", user);
        user.quiz.forEach(function(quiz) {
            if(quiz_service.get_current_quiz_name(req) == quiz.id) {
                callback(quiz.categories);
            };
        });
    })
};

module.exports.add_category = add_category;
module.exports.get_categories = get_categories;