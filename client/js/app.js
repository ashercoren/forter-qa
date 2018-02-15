// App
const app = angular.module('MyApp', ['ngMaterial']);

app.factory('wsServ', [() => {
  
  return {
    start: function (url, callback) {
      var websocket = new WebSocket(url);
      websocket.onopen = function () {
        callback({type:"OPEN"});
      };
      websocket.onclose = function () {
        callback({type:"CLOSE"});
      };
      websocket.onmessage = function (evt) {
        callback({type:"DATA", data:evt});
      };
    }
  }
}]);

// Service to fetch some data..
app.factory('dataServ', ['$http',($http) => {

	return {
		getQuestions : ()=> $http.get('/data'),
    postQuestion : (question) => $http.post('/question',question),
    postAnswer: (id,answer) => $http.post(`/question/${id}/answer`,answer)
	}
}]);

// App controller
app.controller('appController', ['$scope', 'dataServ', 'wsServ', ($scope, Data, WS) => {
  
  fetchData = () => {
    Data.getQuestions().then(resp => {
      $scope.questionList = resp.data;
    });
  };

  hasAnswers = (question) => {
    return question && question.answers && question.answers.length > 0;
  };

  connectToWs = () => {
    WS.start("ws://localhost:3000/", (ev)=>{
      switch (ev.type){
        case "OPEN":
          console.log("WS connected");
          break;
        case "CLOSE":
          console.log("WS disconnected");
          break;
        case "DATA":
          this.fetchData(); 
      }
    })
  };

  $scope.init = () => {
    this.fetchData();
    $scope.newQuestion = {};
    $scope.newAnswer = {};
    connectToWs();
  }

  $scope.state = "questionList";

  $scope.postQuestion = ()=> {
    Data.postQuestion($scope.newQuestion).then(resp=> {
      $scope.questionList = resp.data;
      $scope.cancelQuestion(); 
    })
  };

  $scope.addQuestion = ()=> {
    $scope.state = "newQuestion";
  };

  $scope.answerQuestion = (question) => {
    $scope.currentQuestion = question;
    $scope.state = "newAnswer";
  };

  $scope.showAnswers = (question) => {
    $scope.currentQuestion = question;
    $scope.state = "answerList"
  };

  $scope.showQuestions = () => {
    $scope.currentQuestion = null;
    $scope.state = "questionList";
  };

  $scope.cancelQuestion = () => {
    this.newQuestion = {};
    $scope.state = "questionList";
  };

  $scope.hasAnswers = (question) => {
    return this.hasAnswers(question);
  };

  $scope.postAnswer = () => {
    Data.postAnswer($scope.currentQuestion.id,$scope.newAnswer).then(resp=> {
      $scope.currentQuestion.answers = resp.data;
      $scope.cancelAnswer(); 
    })
  };

  $scope.cancelAnswer = () => {
    $scope.state = this.hasAnswers($scope.currentQuestion) ? "answerList" : "questionList";
    $scope.newAnswer = {};
  };
}]);