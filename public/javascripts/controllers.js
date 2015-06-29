var quizApp = angular.module('quizApp', []);

quizApp.controller('QuestionCtrl', function ($scope, $http) {

    $scope.alternatives = [];

    $scope.update_questions = function() {
        $http.get('/questions.json').success(function(data) {
            $scope.questions = data;
        });
    };

    $scope.add_alternative = function() {
        console.log("Adding alternative");
        $scope.alternatives.push(this.alternative);
        $scope.alternative = null;
    };

    $scope.clear_alternatives = function() {
        console.log("Clearing alternative");
        $scope.alternatives = null;
    };

    $scope.add_question = function() {
        console.log("Adding question");


        $http.post('/add_question', {question:this.question, answer: this.answer, alternatives: this.alternatives}).
            success(function(data, status, headers, config) {
                console.log(data,status);
                $scope.update_questions();
                $scope.alternatives = [];
                $scope.question = null;
                $scope.answer = null;
            });
    };

    $scope.remove_question = function(question) {
        console.log("Removing question");

        $http.post('/remove_question', {question:question}).
            success(function(data, status, headers, config) {
                console.log(data,status);
                $scope.update_questions();
            });
    };

    $scope.update_questions();

});