'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { getQuizById } from '@/lib/storage';
import { Quiz, Question } from '@/types/quiz';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuizPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return [];
}

export default function QuizPage({ params }: QuizPageProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const quizData = getQuizById(params.id);
    if (!quizData) {
      router.push('/browse');
      return;
    }
    setQuiz(quizData);
  }, [params.id, router]);

  useEffect(() => {
    if (quizStarted && quiz && timeLeft > 0 && quiz.questions[currentQuestionIndex].timeLimit) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted && quiz?.questions[currentQuestionIndex].timeLimit) {
      handleNext();
    }
  }, [timeLeft, quizStarted, currentQuestionIndex, quiz]);

  const startQuiz = () => {
    setQuizStarted(true);
    if (quiz) {
      setTimeLeft(quiz.questions[0].timeLimit || 30);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!showFeedback) {
      setShowFeedback(true);
      return;
    }

    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
      if (quiz) {
        setTimeLeft(quiz.questions[currentQuestionIndex + 1].timeLimit || 0);
      }
    } else {
      // Quiz completed
      const sessionId = Date.now().toString();
      router.push(`/results/${params.id}?session=${sessionId}&answers=${encodeURIComponent(JSON.stringify(answers))}`);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowFeedback(false);
      if (quiz) {
        setTimeLeft(quiz.questions[currentQuestionIndex - 1].timeLimit || 0);
      }
    }
  };

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Quiz not found</h1>
          <Button className="mt-4" onClick={() => router.push('/browse')}>
            Browse Quizzes
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const selectedAnswer = answers[currentQuestion.id];
  const correctAnswer = currentQuestion.options.find(opt => opt.isCorrect);

  if (!quizStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mb-4">
              <Badge className="mb-2">{quiz.category}</Badge>
              <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
              <p className="text-gray-600">{quiz.description}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{quiz.questions.length}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {quiz.questions.some(q => q.timeLimit) 
                    ? Math.round(quiz.questions.reduce((acc, q) => acc + (q.timeLimit || 0), 0) / 60) + 'm'
                    : 'No limit'
                  }
                </div>
                <div className="text-sm text-gray-600">Est. Time</div>
              </div>
            </div>
            <Button size="lg" onClick={startQuiz} className="w-full">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          {currentQuestion.timeLimit && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {timeLeft}s
            </div>
          )}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestion.questionText}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentQuestion.type === 'true-false' ? (
            <RadioGroup
              value={selectedAnswer}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              disabled={showFeedback}
            >
              <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                showFeedback && selectedAnswer === 'true'
                  ? correctAnswer?.id === 'true' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200'
              }`}>
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="flex-1 cursor-pointer">True</Label>
                {showFeedback && correctAnswer?.id === 'true' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {showFeedback && selectedAnswer === 'true' && correctAnswer?.id !== 'true' && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className={`flex items-center space-x-2 p-3 rounded-lg border ${
                showFeedback && selectedAnswer === 'false'
                  ? correctAnswer?.id === 'false' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                  : 'border-gray-200'
              }`}>
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="flex-1 cursor-pointer">False</Label>
                {showFeedback && correctAnswer?.id === 'false' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {showFeedback && selectedAnswer === 'false' && correctAnswer?.id !== 'false' && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </RadioGroup>
          ) : (
            <RadioGroup
              value={selectedAnswer}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              disabled={showFeedback}
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    showFeedback && selectedAnswer === option.id
                      ? option.isCorrect 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : showFeedback && option.isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                  {showFeedback && option.isCorrect && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {showFeedback && selectedAnswer === option.id && !option.isCorrect && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              ))}
            </RadioGroup>
          )}

          {showFeedback && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Explanation:</h4>
              <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedAnswer}
        >
          {!showFeedback ? 'Submit Answer' : 
           currentQuestionIndex === quiz.questions.length - 1 ? 'View Results' : 'Next Question'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}