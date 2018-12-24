'use strict';
const Alexa = require('alexa-sdk');

const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Thanks for playing, Bye!';

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
    options: ['Home Speaker 500', 'Soundbar 500', 'Soundbar 700', 'SoundLink Micro'],
    answer: 0
  },
  {
    question: 'How many virtual assistants do you get on Soundbar 700?',
    options: ['3', '2', '1', '4'],
    answer: 1
  },
  {
    question: 'Which one of the soundbars is BOSE’s thinnest soundbar yet?',
    options: ['Soundbar 300', 'Soundbar 500', 'Soundbar 700', 'Soundbar 100'],
    answer: 1
  }
];

const optionsText = ['Option A: ', 'Option B: ', 'Option C: ', 'Option D: '];
const numberText = ['first', 'second', 'third', 'fourth', 'last'];

const handlers = {
  'LaunchRequest': function () {
    this.attributes.currentQuestion = 0;
    this.attributes.score = 0;
    this.emit('AskQuestion');
  },
  'AskQuestion': function () {
    try {
      const questionArr = questions;
      const currentIndex = this.attributes.currentQuestion;
      const question = questionArr[currentIndex];
      this.response.speak(`${getPreQuestionText(currentIndex)} ${getQuestionText(question)}`).listen("And your answer is?");
      this.emit(':responseReady');
    } catch (e) {
      this.response.speak(e.toString());
      this.emit(':responseReady');
    }
  },
  'AnswerIntent': function () {
    try {
      const currentIndex = this.attributes.currentQuestion;
      const question = questions[currentIndex];
      const selectedAnswer = this.event.request.intent.slots.options.value;
      const isCorrect = isCorrectAnswer(question, selectedAnswer);

      if (isCorrect) {
        this.attributes.score++;
      }

      this.attributes.currentQuestion++;

      if (this.attributes.currentQuestion < questions.length) {
        this.response.speak(isCorrect ? `${selectedAnswer} is Correct. Do you want to continue?` : `${selectedAnswer} is incorrect. Do you want to continue?`).listen();
      } else {
        if (this.attributes.score < 5) {
          this.response.speak(`Sorry, your score is ${this.attributes.score}. Better luck next time.`);
        } else {
          this.response.speak(`Congratulations! You won. Your score is 5. You must  have received an OTP on your mobile phone from the sender ABCD. Please confirm the OTP to continue.`)
        }
      }
      this.emit(':responseReady');

    } catch (e) {
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
  alexa.registerHandlers(handlers);
  alexa.execute();
};

function getPreQuestionText(currentIndex) {
  return currentIndex === 0 ? `Okay, Starting Quiz. I'll ask you 5 questions, answer all of them to win an exciting prize! Here is your ${numberText[currentIndex]} question.\n` : `Okay, Moving on to Next Question. Here is your ${numberText[currentIndex]} question.`;
}

function getQuestionText(question) {
  return `${question.question} ${getOptionsText(question)} Which option do you think is correct?`;
}

function getOptionsText(question) {
  return question.options.map((option, index) => `${optionsText[index]} ${option}. `);
}

function isCorrectAnswer(question, selectedAnswer) {
  return getSelectedIndex(selectedAnswer) === question.answer;
}

function getSelectedIndex(answer) {
  if (['a', 'option a', 'A', 'option A', 'option A.'].indexOf(answer) > -1) {
    return 0;
  } else if (['b', 'option b', 'B', 'option B', 'option B.'].indexOf(answer) > -1) {
    return 1;
  } else if (['c', 'option c', 'C', 'option C', 'option C.'].indexOf(answer) > -1) {
    return 2;
  } else if (['d', 'option d', 'D', 'option D', 'option D.'].indexOf(answer) > -1) {
    return 3;
  }
}
