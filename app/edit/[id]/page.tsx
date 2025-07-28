'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Quiz, Question, QuestionType } from '@/types/quiz';
import { getQuizById, saveQuiz } from '@/lib/storage';
import { toast } from 'sonner';

interface EditQuizPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return [];
}

const categories = ['Science', 'History', 'Technology', 'Sports', 'Entertainment', 'Literature', 'Education', 'Health', 'Misc'];

export default function EditQuizPage({ params }: EditQuizPageProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const quizData = getQuizById(params.id);
    if (!quizData) {
      router.push('/my-quizzes');
      return;
    }
    setQuiz(quizData);
    setLoading(false);
  }, [params.id, router]);

  const addQuestion = () => {
    if (!quiz) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      questionText: '',
      options: [
        { id: '1', text: '', isCorrect: true },
        { id: '2', text: '', isCorrect: false },
      ],
      timeLimit: 30,
      explanation: ''
    };

    setQuiz(prev => prev ? {
      ...prev,
      questions: [...prev.questions, newQuestion]
    } : null);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuiz(prev => prev ? {
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    } : null);
  };

  const deleteQuestion = (questionId: string) => {
    setQuiz(prev => prev ? {
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    } : null);
  };

  const addOption = (questionId: string) => {
    setQuiz(prev => prev ? {
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? {
              ...q,
              options: [
                ...q.options,
                { id: Date.now().toString(), text: '', isCorrect: false }
              ]
            }
          : q
      )
    } : null);
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    setQuiz(prev => prev ? {
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId
          ? {
              ...q,
              options: q.options.map(opt => 
                opt.id === optionId ? { ...opt, text } : opt
              )
            }
          : q
      )
    } : null);
  };

  const setCorrectAnswer = (questionId: string, optionId: string) => {
    setQuiz(prev => prev ? {
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId
          ? {
              ...q,
              options: q.options.map(opt => ({
                ...opt,
                isCorrect: opt.id === optionId
              }))
            }
          : q
      )
    } : null);
  };

  const removeOption = (questionId: string, optionId: string) => {
    setQuiz(prev => prev ? {
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter(opt => opt.id !== optionId)
            }
          : q
      )
    } : null);
  };

  const handleSave = () => {
    if (!quiz || !quiz.title || !quiz.description || !quiz.questions.length) {
      toast.error('Please fill in all required fields and add at least one question');
      return;
    }

    saveQuiz(quiz);
    toast.success('Quiz updated successfully!');
    router.push('/my-quizzes');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Quiz not found</h1>
          <Button className="mt-4" onClick={() => router.push('/my-quizzes')}>
            Back to My Quizzes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Edit Quiz</h1>
        <p className="text-gray-600 text-lg">
          Update your quiz content and settings
        </p>
      </div>

      {/* Quiz Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter quiz title..."
              value={quiz.title}
              onChange={(e) => setQuiz(prev => prev ? { ...prev, title: e.target.value } : null)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this quiz is about..."
              value={quiz.description}
              onChange={(e) => setQuiz(prev => prev ? { ...prev, description: e.target.value } : null)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={quiz.category} 
                onValueChange={(value) => setQuiz(prev => prev ? { ...prev, category: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={quiz.isPublic}
                onCheckedChange={(checked) => setQuiz(prev => prev ? { ...prev, isPublic: checked } : null)}
              />
              <Label htmlFor="public">Make quiz public</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Questions</h2>
          <Button onClick={addQuestion}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        {quiz.questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Question {index + 1}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteQuestion(question.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Question Type</Label>
                <Select
                  value={question.type}
                  onValueChange={(value: QuestionType) => 
                    updateQuestion(question.id, { type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Question Text</Label>
                <Textarea
                  placeholder="Enter your question..."
                  value={question.questionText}
                  onChange={(e) => updateQuestion(question.id, { questionText: e.target.value })}
                />
              </div>

              <div>
                <Label>Time Limit (seconds)</Label>
                <Input
                  type="number"
                  min="10"
                  max="300"
                  placeholder="Optional - leave empty for no limit"
                  value={question.timeLimit}
                  onChange={(e) => updateQuestion(question.id, { timeLimit: parseInt(e.target.value) })}
                />
              </div>

              {/* Answer Options */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Answer Options</Label>
                  {question.type === 'multiple-choice' && question.options.length < 6 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(question.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Option
                    </Button>
                  )}
                </div>

                {question.type === 'true-false' ? (
                  <RadioGroup
                    value={question.options.find(opt => opt.isCorrect)?.id || ''}
                    onValueChange={(value) => setCorrectAnswer(question.id, value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id={`${question.id}-true`} />
                      <Label htmlFor={`${question.id}-true`}>True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id={`${question.id}-false`} />
                      <Label htmlFor={`${question.id}-false`}>False</Label>
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <RadioGroup
                          value={question.options.find(opt => opt.isCorrect)?.id || ''}
                          onValueChange={(value) => setCorrectAnswer(question.id, value)}
                        >
                          <RadioGroupItem value={option.id} />
                        </RadioGroup>
                        <Input
                          placeholder="Enter answer option..."
                          value={option.text}
                          onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                          className="flex-1"
                        />
                        {question.options.length > 2 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(question.id, option.id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Explanation (Optional)</Label>
                <Textarea
                  placeholder="Explain the correct answer..."
                  value={question.explanation}
                  onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button variant="outline" onClick={() => router.push('/my-quizzes')}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="sm:order-last">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}