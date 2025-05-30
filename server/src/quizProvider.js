const axios = require('axios');

const DEFAULT_PARAMS = {
  numQuestions: 1,
  type: 'multiple',
  difficulty: 'easy',
  category: 9, // General Knowledge
};

async function fetchQuiz(params = {}) {
  const {
    numQuestions = DEFAULT_PARAMS.numQuestions,
    type = DEFAULT_PARAMS.type,
    difficulty = DEFAULT_PARAMS.difficulty,
    category = DEFAULT_PARAMS.category,
  } = params;

  const url = `https://opentdb.com/api.php?amount=${numQuestions}&type=${type}&difficulty=${difficulty}&category=${category}`;

  try {
    const response = await axios.get(url);
    if (response.data?.results?.length) {
      return response.data.results[0]; // Return the first question
    } else {
      throw new Error('No quiz questions found');
    }
  } catch (error) {
    console.error('[QuizProvider] Failed to fetch quiz:', error.message);
    throw error;
  }
}

module.exports = { fetchQuiz };
