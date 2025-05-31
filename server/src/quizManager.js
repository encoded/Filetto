const { SERVER_TO_ALL } = require('@shared/messages');

class QuizManager {
  constructor(wss, question = null, player = null, timePerQuestion = 10, onQuestionEnd = null) {
    this.wss = wss;
    this.player = player;
    this.question = question;
    this.timePerQuestion = timePerQuestion;
    this.timer = null;
    this.answerReceived = false;
    this.isQuestionActive = false;
    this.onQuestionEnd = onQuestionEnd;  // callback to notify question ended
  }

  start() {
    if (!this.question) {
      console.log("Cannot start quiz without a question.");
      return;
    }
    if (!this.player) {
      console.log("Cannot start quiz without a player.");
      return;
    }

    this.answerReceived = false;
    this.isQuestionActive = true;

    // Prepare and shuffle options
    const options = this.shuffleOptions([
      ...this.question.incorrect_answers,
      this.question.correct_answer,
    ]);
    this.correctAnswer = this.question.correct_answer;
    this.correctIndex = options.findIndex(opt => opt === this.correctAnswer);

    // Send question to the player only
    this.send(this.player, {
      type: SERVER_TO_ALL.QUESTION_START,
      question: this.question.question,
      options,
      correctIndex: this.correctIndex,
      timeLimit: this.timePerQuestion,
    });

    // Set timer to end question
    this.timer = setTimeout(() => this.endQuestion(), this.timePerQuestion * 1000);
  }

  receiveAnswer(ws, selectedIndex) {
    if (ws !== this.player) return; // only accept answer from our single player
    if (!this.isQuestionActive || this.answerReceived) return;

    this.answerReceived = true;
    this.selectedIndex = selectedIndex;

    clearTimeout(this.timer);

    // showing the correct answer and ending the question after 3 seconds
    this.timer = setTimeout(() => this.endQuestion(), 3000);
  }

  endQuestion() {
    this.isQuestionActive = false;

    const correct = this.selectedIndex === this.correctIndex;

    this.send(this.player, {
      type: SERVER_TO_ALL.QUESTION_END,
      correctIndex: this.correctIndex,
      yourAnswer: this.selectedIndex,
      passed: correct,
    });

    // Notify server that question ended and whether passed
    if (this.onQuestionEnd) {
      this.onQuestionEnd(correct);
    }
  }

  send(ws, data) {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(data));
    }
  }

  shuffleOptions(options) {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }
}

module.exports = QuizManager;
