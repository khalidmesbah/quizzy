import { Quiz, QuizAttempt } from '@/types/quiz';

const QUIZZES_KEY = 'quizzy_quizzes';
const ATTEMPTS_KEY = 'quizzy_attempts';

// Initialize with sample data if empty
const initializeSampleData = () => {
  const existingQuizzes = localStorage.getItem(QUIZZES_KEY);
  if (!existingQuizzes) {
    const sampleQuizzes: Quiz[] = [
      {
        id: '1',
        title: 'Introduction to JavaScript',
        description: 'Test your knowledge of JavaScript fundamentals including variables, functions, and basic syntax.',
        category: 'Technology',
        isPublic: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        attempts: 256,
        questions: [
          {
            id: '1-1',
            type: 'multiple-choice',
            questionText: 'Which of the following is used to declare a variable in JavaScript?',
            timeLimit: 30,
            explanation: 'var, let, and const are all used to declare variables in JavaScript, with different scoping rules.',
            options: [
              { id: '1', text: 'var', isCorrect: false },
              { id: '2', text: 'let', isCorrect: false },
              { id: '3', text: 'const', isCorrect: false },
              { id: '4', text: 'All of the above', isCorrect: true }
            ]
          },
          {
            id: '1-2',
            type: 'true-false',
            questionText: 'JavaScript is a statically typed language.',
            timeLimit: null,
            explanation: 'JavaScript is dynamically typed, meaning variable types are determined at runtime.',
            options: [
              { id: 'true', text: 'True', isCorrect: false },
              { id: 'false', text: 'False', isCorrect: true }
            ]
          }
        ]
      },
      {
        id: '2',
        title: 'World Geography Quiz',
        description: 'Challenge yourself with questions about countries, capitals, and geographical features around the world.',
        category: 'Education',
        isPublic: true,
        createdAt: '2024-01-14T15:30:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
        attempts: 189,
        questions: [
          {
            id: '2-1',
            type: 'multiple-choice',
            questionText: 'What is the capital of Australia?',
            timeLimit: 30,
            explanation: 'Canberra is the capital of Australia, not Sydney or Melbourne as commonly thought.',
            options: [
              { id: '1', text: 'Sydney', isCorrect: false },
              { id: '2', text: 'Melbourne', isCorrect: false },
              { id: '3', text: 'Canberra', isCorrect: true },
              { id: '4', text: 'Perth', isCorrect: false }
            ]
          },
          {
            id: '2-2',
            type: 'multiple-choice',
            questionText: 'Which is the longest river in the world?',
            timeLimit: 25,
            explanation: 'The Nile River in Africa is considered the longest river in the world at approximately 6,650 km.',
            options: [
              { id: '1', text: 'Amazon River', isCorrect: false },
              { id: '2', text: 'Nile River', isCorrect: true },
              { id: '3', text: 'Mississippi River', isCorrect: false },
              { id: '4', text: 'Yangtze River', isCorrect: false }
            ]
          }
        ]
      },
      {
        id: '3',
        title: 'Science Fundamentals',
        description: 'Basic science questions covering physics, chemistry, and biology concepts.',
        category: 'Science',
        isPublic: true,
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:15:00Z',
        attempts: 342,
        questions: [
          {
            id: '3-1',
            type: 'multiple-choice',
            questionText: 'What is the chemical symbol for gold?',
            timeLimit: 20,
            explanation: 'Au comes from the Latin word "aurum" meaning gold.',
            options: [
              { id: '1', text: 'Go', isCorrect: false },
              { id: '2', text: 'Gd', isCorrect: false },
              { id: '3', text: 'Au', isCorrect: true },
              { id: '4', text: 'Ag', isCorrect: false }
            ]
          },
          {
            id: '3-2',
            type: 'true-false',
            questionText: 'The human body has 206 bones.',
            timeLimit: 15,
            explanation: 'An adult human skeleton typically has 206 bones.',
            options: [
              { id: 'true', text: 'True', isCorrect: true },
              { id: 'false', text: 'False', isCorrect: false }
            ]
          }
        ]
      }
    ];
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(sampleQuizzes));
  }
};

export const getAllQuizzes = (): Quiz[] => {
  if (typeof window === 'undefined') return [];
  initializeSampleData();
  const quizzes = localStorage.getItem(QUIZZES_KEY);
  return quizzes ? JSON.parse(quizzes) : [];
};

export const getFeaturedQuizzes = (): Quiz[] => {
  const allQuizzes = getAllQuizzes();
  return allQuizzes.slice(0, 6);
};

export const getMyQuizzes = (): Quiz[] => {
  const allQuizzes = getAllQuizzes();
  // In a real app, this would filter by user ID
  // For now, return all quizzes as if they're user-created
  return allQuizzes;
};

export const getQuizById = (id: string): Quiz | null => {
  const quizzes = getAllQuizzes();
  return quizzes.find(quiz => quiz.id === id) || null;
};

export const saveQuiz = (quiz: Quiz): void => {
  if (typeof window === 'undefined') return;
  const quizzes = getAllQuizzes();
  const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
  
  if (existingIndex >= 0) {
    quizzes[existingIndex] = { ...quiz, updatedAt: new Date().toISOString() };
  } else {
    quizzes.unshift(quiz);
  }
  
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
};

export const deleteQuiz = (id: string): void => {
  if (typeof window === 'undefined') return;
  const quizzes = getAllQuizzes();
  const filtered = quizzes.filter(quiz => quiz.id !== id);
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(filtered));
};

export const duplicateQuiz = (id: string): Quiz | null => {
  const originalQuiz = getQuizById(id);
  if (!originalQuiz) return null;

  const duplicatedQuiz: Quiz = {
    ...originalQuiz,
    id: Date.now().toString(),
    title: `${originalQuiz.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attempts: 0,
    questions: originalQuiz.questions.map(q => ({
      ...q,
      id: `${Date.now()}-${q.id}`
    }))
  };

  saveQuiz(duplicatedQuiz);
  return duplicatedQuiz;
};

export const saveQuizAttempt = (attempt: QuizAttempt): void => {
  if (typeof window === 'undefined') return;
  const attempts = localStorage.getItem(ATTEMPTS_KEY);
  const allAttempts: QuizAttempt[] = attempts ? JSON.parse(attempts) : [];
  allAttempts.push(attempt);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(allAttempts));

  // Update quiz attempt count
  const quizzes = getAllQuizzes();
  const quizIndex = quizzes.findIndex(q => q.id === attempt.quizId);
  if (quizIndex >= 0) {
    quizzes[quizIndex].attempts = (quizzes[quizIndex].attempts || 0) + 1;
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
  }
};

export const getQuizAttempts = (quizId: string): QuizAttempt[] => {
  if (typeof window === 'undefined') return [];
  const attempts = localStorage.getItem(ATTEMPTS_KEY);
  const allAttempts: QuizAttempt[] = attempts ? JSON.parse(attempts) : [];
  return allAttempts.filter(attempt => attempt.quizId === quizId);
};