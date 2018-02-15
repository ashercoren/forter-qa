var questions = {};
const observe = require('observe');
const observer = observe(questions);

var idCounter = 0;

module.exports = {

  addQuestion: question => {
    let newId = idCounter++;
    question.id = newId;
    question.answers = [];
    observer.set(newId,question);
  },

  addAnswer: (questionId,answer) => {
    observer.get(questionId).get('answers').push(answer);
  },

  getQuestions: () => {
    return observer.subject;
  },

  addListener: (listener) => {
    observer.on('change',listener);
  }
}