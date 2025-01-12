export const APP_CONFIG = {
  name: 'Exam Generator',
  version: '0.1.0',
  features: {
    testGeneration: true,
    analysis: true,
    history: true,
  },
  limits: {
    maxQuestionsPerTest: 100,
    maxAttemptsPerDay: 10,
  },
} as const;

export const QUESTION_TYPES = {
  MCQ: 'mcq',
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
} as const;