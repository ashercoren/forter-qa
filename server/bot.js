const find = require('lodash.find');

const funnyStuff = [{question: `Why did the chicken cross the road?`,
                     answer: `To get to the other side`},
                    
                    {question: `How much wood would a woodchuck chuck if a woodchuck could chuck wood?`,
                     answer: `A woodchuck would chuck as much wood as a woodchuck could chuck if a woodchuck could chuck wood`}];

var sillyQuestionIndex = 0;

askSillyQuestion = (data) => {
  if (sillyQuestionIndex < funnyStuff.length) {
    data.addQuestion({user:"STUPID BOT", text: funnyStuff[sillyQuestionIndex++].question});
  }
};

module.exports = (data) => {

  data.addListener(change => {
    if (change.type === 'set') {
      let questions = data.getQuestions();
      let questionId = change.property[0];
      let question = questions[questionId];
      
      let funnyQuestion = funnyStuff.find(f => f.question === question.text);
      if (funnyQuestion){
        setTimeout(()=> {data.addAnswer(questionId,{user:"SMART BOT", text: funnyQuestion.answer})}, 10000);
      }
      else {
        let existingQuestion = find(questions, q => q.text === question.text &&
                                                    q.id !== question.id &&
                                                    q.answers.length > 0);
        if (existingQuestion) {
          let answer = existingQuestion.answers[0];
          data.addAnswer(questionId,{user:answer.user, text: answer.text});
        }
      }

    }
  });

  setInterval(() => {
    let r = Math.random() * 10;
    if (r > 9){
      askSillyQuestion(data);
    }
  } , 2000);
 
}