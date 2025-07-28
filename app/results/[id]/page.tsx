'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Share2, RotateCcw, Home, CheckCircle, XCircle, Trophy, Target } from 'lucide-react';
import { getQuizById, saveQuizAttempt } from '@/lib/storage';
import { Quiz } from '@/types/quiz';

interface ResultsPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return [];
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    const quizData = getQuizById(params.id);
    if (!quizData) {
      router.push('/browse');
      return;
    }

    const answersParam = searchParams.get('answers');
    const sessionId = searchParams.get('session');
    
    if (!answersParam || !sessionId) {
      router.push(`/quiz/${params.id}`);
      return;
    }

    try {
      const userAnswers = JSON.parse(decodeURIComponent(answersParam));
      setAnswers(userAnswers);
      setQuiz(quizData);
      setTotalQuestions(quizData.questions.length);

      // Calculate score
      let correctCount = 0;
      quizData.questions.forEach(question => {
        const userAnswer = userAnswers[question.id];
        const correctOption = question.options.find(opt => opt.isCorrect);
        
        if (question.type === 'true-false') {
          if ((userAnswer === 'true' && correctOption?.id === 'true') ||
              (userAnswer === 'false' && correctOption?.id === 'false')) {
            correctCount++;
          }
        } else {
          if (userAnswer === correctOption?.id) {
            correctCount++;
          }
        }
      });

      setScore(correctCount);

      // Save attempt
      saveQuizAttempt({
        id: sessionId,
        quizId: params.id,
        sessionId,
        score: correctCount,
        totalQuestions: quizData.questions.length,
        completedAt: new Date().toISOString(),
        answersData: userAnswers
      });

    } catch (error) {
      console.error('Error parsing results:', error);
      router.push(`/quiz/${params.id}`);
    }
  }, [params.id, searchParams, router]);

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding! 🎉", color: "text-green-600" };
    if (percentage >= 80) return { message: "Excellent work! 👏", color: "text-green-600" };
    if (percentage >= 70) return { message: "Good job! 👍", color: "text-blue-600" };
    if (percentage >= 60) return { message: "Not bad! 📚", color: "text-yellow-600" };
    return { message: "Keep practicing! 💪", color: "text-red-600" };
  };

  const performance = getPerformanceMessage();

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I scored ${percentage}% on "${quiz?.title}"`,
          text: `Check out this quiz on Quizzy!`,
          url: window.location.origin + `/quiz/${params.id}`,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(
          `I scored ${percentage}% on "${quiz?.title}" - ${window.location.origin}/quiz/${params.id}`
        );
      }
    } else {
      navigator.clipboard.writeText(
        `I scored ${percentage}% on "${quiz?.title}" - ${window.location.origin}/quiz/${params.id}`
      );
    }
  };

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Score Overview */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
        <p className={`text-2xl font-semibold ${performance.color}`}>
          {performance.message}
        </p>
      </div>

      {/* Score Card */}
      <Card className="mb-8 border-none shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            {score} / {totalQuestions}
          </CardTitle>
          <p className="text-gray-600">Correct Answers</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Your Score</span>
                <span className="font-semibold">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-red-600">{totalQuestions - score}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Details */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Badge className="mb-2">{quiz.category}</Badge>
              <CardTitle>{quiz.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{quiz.description}</p>
        </CardContent>
      </Card>

      {/* Question by Question Review */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const correctOption = question.options.find(opt => opt.isCorrect);
              let isCorrect = false;

              if (question.type === 'true-false') {
                isCorrect = (userAnswer === 'true' && correctOption?.id === 'true') ||
                           (userAnswer === 'false' && correctOption?.id === 'false');
              } else {
                isCorrect = userAnswer === correctOption?.id;
              }

              const userAnswerText = question.type === 'true-false' 
                ? userAnswer 
                : question.options.find(opt => opt.id === userAnswer)?.text || 'No answer';

              return (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-600">
                      Question {index + 1}
                    </h4>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <p className="font-medium mb-2">{question.questionText}</p>
                  <div className="text-sm space-y-1">
                    <p className={`${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      Your answer: {userAnswerText}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-600">
                        Correct answer: {correctOption?.text || correctOption?.id}
                      </p>
                    )}
                    {question.explanation && (
                      <p className="text-gray-600 mt-2 p-2 bg-gray-50 rounded">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push('/')}>
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button variant="outline" onClick={shareResults}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>
        <Button onClick={() => router.push(`/quiz/${params.id}`)}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Quiz
        </Button>
        <Button variant="outline" onClick={() => router.push('/browse')}>
          <Target className="mr-2 h-4 w-4" />
          Try More Quizzes
        </Button>
      </div>
    </div>
  );
}