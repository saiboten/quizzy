var mongojs = require("mongojs");
var user_service = require("./user_service");
var quiz_service = require("./quiz_service");
var db = mongojs('quizzy', ["users"]);

var add_category = function(req, category, callback) {

    var category = category.toLowerCase();

    db.users.findOne({username: user_service.get_username(req)}, function(err, user) {
        for(var i = 0; i<user.quiz.length; i++) {
            var quiz = user.quiz[i];

            if(quiz_service.get_current_quiz_name(req) == quiz.id) {
                console.log("Adding category: ", category);

                if(user.quiz[i].categories.filter(function(elem) {
                    return elem.name == category;
                }).length > 0) {
                    console.log("Category already exists");
                    callback(false, "Kategori finnes allerede");
                }
                else {
                    user.quiz[i].categories.push({name: category, questions: []});

                    console.log("Category service - User: ", user);

                    db.users.save(user, function(err, user_updated) {
                        console.log("Category added, user after quiz created: ", user_updated);
                        callback(true, "");
                    });
                }
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

var get_category = function(req, category_name, callback) {
    db.users.findOne({username: user_service.get_username(req)}, function(err, user) {
        console.log("Getting categories for user: ", user);
        user.quiz.forEach(function(quiz) {
            if(quiz_service.get_current_quiz_name(req) == quiz.id) {
               var return_category = quiz.categories.reduce(function(prev,curr) {
                   if(prev) {
                       return prev;
                   }
                   else {
                       if(curr.name == category_name) {
                           return curr;
                       }
                   }
               },undefined);

                callback(return_category);
            };
        });
    })
};

var replace_category = function(req, new_category, callback) {
    db.users.findOne({username: user_service.get_username(req)}, function(err, user) {
        console.log("Getting categories for user: ", user);
        user.quiz.forEach(function(quiz) {
            if(quiz_service.get_current_quiz_name(req) == quiz.id) {

                for(var i = 0; i< quiz.categories.length;i++) {
                    var current_category = quiz.categories[i];
                    if(current_category.name == new_category.name) {
                        quiz.categories[i] = new_category;

                        db.users.save(user, function(err, user_updated) {
                            console.log("Category replaced, user afterwards: ", user_updated);
                            callback(true);
                            category_found = true;
                        });
                    }
                }


            };
        });
    })
};

module.exports.add_category = add_category;
module.exports.get_categories = get_categories;
module.exports.get_category = get_category;
module.exports.replace_category = replace_category;