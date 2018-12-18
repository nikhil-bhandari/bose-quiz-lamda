'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = undefined;

const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const questions = [
  {
    question: 'Which company created the first noise cancelling headphones?',
    options: ['BOSE', 'SONY', 'JBL', 'SENNHEISER'],
    answer: 0
  },
  {
    question: 'Who is the founder of BOSE?',
    options: ['Dr. Samar Bose', 'Dr. Amar Bose', 'Dr. Prema Bose', 'Dr. Vanu Bose'],
    answer: 1
  },
  {
    question: 'Which one of the BOSE speakers provide wall-to-wall stereo?',
    options: ['Home Speaker 500',  'Soundbar 500', 'Soundbar 700', 'SoundLink Micro'],
    answer: 0
  },
  {
    question: 'How many virtual assistants do you get on Soundbar 700?',
    options: ['3',  '2', '1', '4'],
    answer: 1
  },
  {
    question: 'Which one of the soundbars is BOSE’s thinnest soundbar yet?',
    options: ['Soundbar 300',  'Soundbar 500', 'Soundbar 700', 'Soundbar 100'],
    answer: 1
  }
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
  'LaunchRequest': function () {
    this.attributes.currentQuestion = 0;
    this.attributes.score = 0;
    this.emit('AskQuestion');
  },
  'AskQuestion': function () {

    try{
      const questionArr = questions;
      const currentIndex = this.attributes.currentQuestion;
      const question = questionArr[currentIndex];
      const number = ['first', 'second', 'third', 'last'];


      const optionsText = ['A: ', 'B: ', 'C: ', 'D: ']
      const welcomeMessage = currentIndex === 0 ? `Welcome to Bose Quiz App. I'll ask you 5 questions, answer any 5 of them to win exciting prizes.\n` : 'Ok, Moving on to Next Question. ';

      this.response.speak(`
            ${welcomeMessage}Here is your ${number[currentIndex]} question.
            
            ${question.question}
            
            ${question.options.map((option, index) => `${optionsText[index]} ${option}`)}
        `).listen("And your answer is?");
      this.emit(':responseReady');
    }
    catch(e){
      this.response.speak(e.toString());
      this.emit(':responseReady');
    }

  },
  'AnswerIntent': function(){
    try{
      const currentIndex = this.attributes.currentQuestion;
      const question = questions[currentIndex];
      const answer = '';
      if(answer !== question.answer){
        this.attributes.score++;
      }

      this.attributes.currentQuestion++;

      if(this.attributes.currentQuestion < questions.length){
        this.response.speak('Ok, Do you want to continue').listen();
      } else{
        if(this.attributes.score < 5) {
          this.response.speak(`Sorry, your score is less than 5. Better luck next time.`);
        } else {
          this.response.speak(`Congratulations! You won. Your score is 5. You must  have recieved an OTP on your mobile phone from the sender ABCD. Please confirm the OTP to continue.`)
        }
      }
      this.emit(':responseReady');

    }catch(e){
      this.response.speak(e.toString());
      this.emit(':responseReady');
    }
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = HELP_MESSAGE;
    const reprompt = HELP_REPROMPT;

    this.response.speak(speechOutput).listen(reprompt);
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
    this.response.speak(STOP_MESSAGE);
    this.emit(':responseReady');
  },
};

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context, callback);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
