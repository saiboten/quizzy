
var mongojs = require("mongojs");

var db = mongojs('quizzy', ["categories","users"]);
var quiz_service = require("./quiz_service");
var category_service = require("./category_service");
var user_service = require("./user_service");

var guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4();
}

var add_question = function(req, category,question) {
    console.log("Adding question, quiz: ", quiz_service.get_current_quiz_name(req), ", category", category, ", question",  question);

    question.id = guid();

    db.users.findOne({username : user_service.get_username(req)}, function(err, storeduser) {
        console.log("Quiz name: ", quiz_service.get_current_quiz_name(req));

        storeduser.quiz.forEach(function(thequiz) {
           if(quiz_service.get_current_quiz_name(req) === thequiz.id) {
               console.log("We found the right quiz. Time to add the question: ", thequiz.categories);
               thequiz.categories.forEach(function(elem) {
                   console.log("elem.name", elem.name, "category", category);

                   if(elem.name == category.name) {
                        console.log("Found the correct category to add question: ", category.name);

                        elem.questions.push(question);
                    }
               })
           }
        });

        console.log("Storing user: ", storeduser);

        db.users.save(storeduser, function(err, user) {
            console.log("err: ", err);
            console.log("User after question save: ", user);
        });

        console.log("User storing done, time to store question to question list");

        db.categories.findOne({category: category}, function(err, cat) {
           if(err) {
               console.log("Wups. Error");
           }

           if(cat == undefined) {
               console.log("This category does not exist yet. Creating category");
               cat = {};
               cat.category = category.name;
               cat.questions = [];
           }

           cat.questions.push(question);

            console.log("Storing this category: ", cat);

            db.categories.save(cat, function(err, catstored) {
                console.log("Category storied: ", catstored);
            })
        });
    });
};

var add_random_question = function(req, category, callback) {
    console.log("Adding random question, quiz: ", quiz_service.get_current_quiz_name(req), ", category", category);

    db.users.findOne({username : user_service.get_username(req)}, function(err, storeduser) {
        console.log("Quiz name: ", quiz_service.get_current_quiz_name(req));

        storeduser.quiz.forEach(function(thequiz) {
            if(quiz_service.get_current_quiz_name(req) === thequiz.id) {
                console.log("We found the right quiz. Time to add the question: ", thequiz.categories);

                db.categories.findOne({category: category}, function(err, cat) {

                    console.log("err", err, ", cat", cat);

                    if(cat && cat.questions.length > 0) {
                        console.log("Found category. And it even has questions? Let's add a random one!");

                        function getRandomInt(min, max) {
                            return Math.floor(Math.random() * (max - min)) + min;
                        }

                        console.log("Category questions: ", cat.questions);
                        var random_int = getRandomInt(0,cat.questions.length);

                        console.log("Random int: ", random_int);
                        var random_question = cat.questions[random_int];
                        console.log("Random question: ", random_question);
                        random_question.id = guid();

                        thequiz.categories.forEach(function(elem) {
                            if(category == elem.name) {
                                console.log("Found the right category for the question! Pushing new question to this category: ", category);
                                elem.questions.push(random_question);
                            }
                        });


                        console.log("Storing user: ", storeduser);

                        db.users.save(storeduser, function(err, user) {
                            console.log("err: ", err);
                            console.log("User after question save: ", user);
                            callback(true);
                        });
                    }
                    else {
                        console.log("Trying to add question to a category without questions");
                        callback(false);
                    }
                });
            }
        });
    });
};

var question_order_up = function(question) {
/*    console.log("Bumping the order of question: " + question);

    db.users.findOne({username: username},function(err,user) {
       for(var i = 0; i < questions.length; i++) {
            console.log( i + ": " + questions[i].question);

            if(question === questions[i].question) {
                console.log("Found question to be upped in location: " + i);

                if(i==0) {
                    console.log("It's already at the top. Ignore");
                }
                else {
                    var tmp = questions[i];
                    questions[i] = questions[i-1];
                    questions[i].index = i;
                    questions[i-1] = tmp;
                    questions[i-1].index = i-1;

                    db.questions.save(questions[i], function() {
                        console.log("Callback from save questions after upping question called.");
                    });

                    db.questions.save(questions[i-1], function() {
                        console.log("Callback from save questions after upping question called.");
                    });
                }
            }
        }
    });
*/
};

var delete_question = function(req, category_name, question_id, callback) {
    console.log("Deleting question: ", question_id);
    category_service.get_category(req, category_name, function(category) {
        console.log("Returned category: ", category);
        if(category) {
            console.log("Question length: ", category.questions.length);
            for(var i = 0; i < category.questions.length; i++) {
                var question = category.questions[i];
                console.log("Question: ", question);
                if (question.id = question_id) {
                    console.log("Found question to delete, it is: ", question);
                    category.questions.splice(i,1);
                    category_service.replace_category(req, category,function(success) {
                        console.log("Category replaced success? ", success);
                       callback(success);
                    });
                }
            }
        }
        else {
            callback(false);
        }


    });
};

var remove_question = function(question) {
    console.log("Removing question: " + question);

    db.questions.remove({question: question}, function(err, numberOfRemovedDocs) {
        console.log("Questions removed: ", numberOfRemovedDocs);
    });
};

var get_questions = function(req, category,callback) {
    console.log("Getting questions, quiz: ", quiz_service.get_current_quiz_name(req), ", username: ", user_service.get_username(req));
    db.users.findOne({username: user_service.get_username(req)},function(err,user) {
        console.log("Found data: ", err, user);
        callback(user[quiz][category]);
    });
};

exports.add_question = add_question;
exports.remove_question = remove_question;
exports.question_order_up = question_order_up;
exports.add_random_question = add_random_question;
exports.delete_question = delete_question;