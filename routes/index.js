var express = require('express');
var router = express.Router();
var question_service = require("./../modules/question_service");
var user_service = require("./../modules/user_service");
var category_service = require("./../modules/category_service");

var quiz_service = require("./../modules/quiz_service");

router.get('/', function(req, res, next) {
    res.sendFile("html/index.html",{ root: "./views" });
});

router.get('/quizadmin/:quizname', function(req, res, next) {
    quiz_service.set_current_quiz_name(req.params.quizname);
    res.sendFile("html/admin.html",{ root: "./views" });
});

router.get('/quiz/:quizname', function(req, res, next) {
    quiz_service.set_current_quiz_name(req.params.quizname);
    res.sendFile("html/quiz.html",{ root: "./views" });
});

router.get('/quizselector', function(req, res, next) {
    res.sendFile("html/quizselector.html",{ root: "./views" });
});

router.get('/questionshidden', function(req, res, next) {
    res.sendFile("html/questionshidden.html",{ root: "./views" });
});

router.post('/add_quiz', function(req, res, next) {
    console.log("Adding quiz, quiz name: ", req.body.quiz_name);
    quiz_service.add_quiz(req.body.quiz_name);
    res.json({success: true});
});

router.post('/add_random_question', function(req, res, next) {
    console.log("Adding random question: ", req.body.category);
    question_service.add_random_question(req.body.category, function(success) {
        res.json({success: success});
    });

});

router.post('/add_category', function(req, res, next) {
    console.log("Adding category: ", req.body.category_name);
    category_service.add_category(req.body.category_name);
    res.json({success: true});
});

router.get('/categories.json', function(req, res, next) {
    category_service.get_categories(function(categories) {
        res.json(categories);
    });
});


router.get('/quizzes.json', function(req, res, next) {
    quiz_service.get_quizzes(function(quizlist) {
        res.json(quizlist);
    })
});

router.post('/set_username', function(req, res, next) {
    console.log("Setting username to: ", req.body.username);
    user_service.set_username(req.body.username);
    res.json({success: true});
});

router.get('/quiz.json', function(req, res, next) {
    quiz_service.get_current_quiz(function(questions) {
        res.json(questions);
    });
});

router.post('/add_question', function(req, res, next) {
    console.log("Adding question with the following data: ", req.body);
    res.json(question_service.add_question(req.body.category,{question: req.body.question, alternatives: req.body.alternatives, answer: req.body.answer}));
});

router.post('/remove_question', function(req, res, next) {
    console.log("Question to be removed: ", req.body.question);
    res.json(question_service.remove_question(req.body.question));
});

router.post('/up_question', function(req, res, next) {
    console.log("Question to be upped: ", req.body.question);
    res.json(question_service.question_order_up(req.body.question));
});

module.exports = router;