var express = require('express');
var router = express.Router();
var question_service = require("./../modules/question_service");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile("html/index.html",{ root: "./views" });
});

router.get('/quiz', function(req, res, next) {
    res.sendFile("html/quiz.html",{ root: "./views" });
});

router.get('/questions.json', function(req, res, next) {
    question_service.get_questions(function(questions) {
        res.json(questions);
    });
});

router.post('/add_question', function(req, res, next) {
    console.log("Body data: ", req.body);
    res.json(question_service.add_question({question: req.body.question, alternatives: req.body.alternatives, answer: req.body.answer}));
});

router.post('/remove_question', function(req, res, next) {
    console.log("Question to be removed: ", req.body.question);
    res.json(question_service.remove_question(req.body.question));
});

module.exports = router;