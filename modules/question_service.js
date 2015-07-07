
var mongojs = require("mongojs");

var db = mongojs('quizzy', ["categories","users"]);
var quiz_service = require("./quiz_service");
var user_service = require("./user_service");

var add_question = function(category,question) {
    console.log("Adding question, quiz: ", quiz_service.get_current_quiz_name(), ", category", category, ", question",  question);

    db.users.findOne({username : user_service.get_username()}, function(err, storeduser) {
        console.log("Quiz name: ", quiz_service.get_current_quiz_name());

        storeduser.quiz.forEach(function(thequiz) {
           if(quiz_service.get_current_quiz_name() === thequiz.quiz) {
               console.log("We found the right quiz. Time to add the question: ", thequiz.categories);
               thequiz.categories[category].push(question);
           }
        });

        console.log("Storing user: ", storeduser);

        db.users.save(storeduser, function(err, user) {
            console.log("err: ", err);
            console.log("User after question save: ", user);
        });

        db.categories.findOne({category: category}, function(err, cat) {
           if(err) {
               console.log("Wups. Error");
           }

           if(cat == undefined) {
               console.log("This category does not exist yet. Creating category");
               cat = {};
               cat.category = category;
               cat.questions = [];
           }

           cat.questions.push(question);

            console.log("Storing this category: " + cat);

            db.categories.save(cat, function(err, catstored) {
                console.log("Category storied: ", catstored);
            })
        });
    });
};

var add_random_question = function(category, callback) {
    console.log("Adding random question, quiz: ", quiz_service.get_current_quiz_name(), ", category", category);

    db.users.findOne({username : user_service.get_username()}, function(err, storeduser) {
        console.log("Quiz name: ", quiz_service.get_current_quiz_name());

        storeduser.quiz.forEach(function(thequiz) {
            if(quiz_service.get_current_quiz_name() === thequiz.quiz) {
                console.log("We found the right quiz. Time to add the question: ", thequiz.categories);

                db.categories.findOne({category: category}, function(err, cat) {
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

                        thequiz.categories[category].push(random_question);


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

var remove_question = function(question) {
    console.log("Removing question: " + question);

    db.questions.remove({question: question}, function(err, numberOfRemovedDocs) {
        console.log("Questions removed: ", numberOfRemovedDocs);
    });
};

var get_questions = function(category,callback) {
    console.log("Getting questions, quiz: ", quiz_service.get_current_quiz_name(), ", username: ", user_service.get_username());
    db.users.findOne({username: user_service.get_username()},function(err,user) {
        console.log("Found data: ", err, user);
        callback(user[quiz][category]);
    });
};

exports.add_question = add_question;
exports.get_questions = get_questions;
exports.remove_question = remove_question;
exports.question_order_up = question_order_up;
exports.add_random_question = add_random_question;