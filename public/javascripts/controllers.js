var quizApp = angular.module('quizApp', []);

quizApp.controller('UsernameCtrl', function($scope, $http) {

    $scope.google_auth = function() {
        $http.get('/authwithgoogle').
            success(function(data, status, headers, config) {
                if(data.url) {
                    console.log("Data url received: ", data.url);
                    window.location = data.url;
                }
        });
    };

     $scope.user_submitted = function() {
         console.log("User submitted, username: ", this.username);

         $http.post('/set_username', {username:this.username}).
             success(function(data, status, headers, config) {
                 if(data.success) {
                     console.log("User name sat successfully! Time to go to next step");
                     window.location.reload();
                 }
         });
     }
});

quizApp.controller('QuizNameCtrl', function($scope, $http) {
    $scope.quizzes = [];

    $scope.get_quizzes = function() {
        $http.get('/quizzes.json').success(function(data) {
            $scope.quizzes = data.quizzes;
            $scope.username = data.username;
        });
    };

    $scope.add_quiz = function() {
        console.log("Adding new quiz. ", this.quiz_name);
        $http.post('/add_quiz', {quiz_name: this.quiz_name}).success(function(data) {
            if(data) {
                $scope.status = "Quiz added successfully";
                $scope.get_quizzes();
            }
            else {
                $scope.status = data.error_message;
            }
        });
    }

    $scope.get_quizzes();
});


quizApp.controller('QuestionCtrl', function ($scope, $http) {

    $scope.alternatives = {};

    $scope.categories = [];

    $scope.get_categories = function() {
        $http.get('/categories.json').success(function(data) {
            console.log("Categories data: ", data);
            $scope.categories = data.categories;
            $scope.username = data.username;
        });
    };

    $scope.add_category = function() {
        console.log("Adding new category. ", this.category_name);
        $http.post('/add_category', {category_name: this.category_name}).success(function(data) {
            $scope.status = "Category added";
            $scope.get_categories();
            $scope.update_questions();
        });
    };

    $scope.add_random_question = function(category) {
        console.log("Adding new random question. ", category);
        $http.post('/add_random_question', {category: category}).success(function(data) {
            console.log("Updating questions");
            if(data) {
                $scope.status = "La til tilfeldig spørsmål.";
            }
            else {
                $scope.status = "Fant ingen spørsmål å legge til i denne kategorien.";
            }
            $scope.update_questions();

        });
    };

    $scope.get_categories();

    $scope.update_questions = function() {
        $http.get('/quiz.json').success(function(data) {
            $scope.quiz = data;
        });
    };

    $scope.add_alternative = function(alternative) {
        console.log("Adding alternative on category: ", this.category.name);
        if($scope.alternatives[this.category.name] == null) {
            console.log("Empty alternative list. Creating list");
            $scope.alternatives[this.category.name] = [];
        }
        $scope.alternatives[this.category.name].push(this.alternative);
        this.alternative = "";
    };

    $scope.clear_alternatives = function(category) {
        console.log("Clearing alternative");
        $scope.alternatives[category] = undefined;
    };

    $scope.add_question = function(category) {
       console.log("Adding question: ", category, "spørsmål", this.question, "svar", this.answer, "alternativer", this.alternatives[category]);

      $http.post('/add_question', {question:this.question, answer: this.answer, alternatives: this.alternatives[category], category: this.category}).
            success(function(data, status, headers, config) {
                console.log(data,status);
                $scope.update_questions();
                $scope.alternatives[category] = [];
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

    $scope.question_up_order = function(question) {
        console.log("Upping order of question: ", question);

        $http.post('/up_question', {question:question}).
            success(function(data, status, headers, config) {
                console.log(data,status);
                $scope.update_questions();
            });
    };

    $scope.update_questions();

});