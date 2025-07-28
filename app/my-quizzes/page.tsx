'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { getMyQuizzes, deleteQuiz, duplicateQuiz } from '@/lib/storage';
import { Quiz } from '@/types/quiz';
import QuizCard from '@/components/QuizCard';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function MyQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);

  useEffect(() => {
    const myQuizzes = getMyQuizzes();
    setQuizzes(myQuizzes);
    setFilteredQuizzes(myQuizzes);
  }, []);

  useEffect(() => {
    const filtered = quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuizzes(filtered);
  }, [quizzes, searchTerm]);

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteQuizId(id);
  };

  const confirmDelete = () => {
    if (deleteQuizId) {
      deleteQuiz(deleteQuizId);
      setQuizzes(prev => prev.filter(q => q.id !== deleteQuizId));
      setDeleteQuizId(null);
      toast.success('Quiz deleted successfully');
    }
  };

  const handleDuplicate = (id: string) => {
    const duplicatedQuiz = duplicateQuiz(id);
    if (duplicatedQuiz) {
      setQuizzes(prev => [duplicatedQuiz, ...prev]);
      toast.success('Quiz duplicated successfully');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Quizzes</h1>
          <p className="text-gray-600 text-lg">
            Manage and edit your created quizzes
          </p>
        </div>
        <Button asChild>
          <div onClick={() => router.push('/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </div>
        </Button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search your quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {quizzes.length === 0 ? 'No quizzes yet' : 'No quizzes found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {quizzes.length === 0 
                ? 'Create your first quiz to get started'
                : 'Try adjusting your search terms'
              }
            </p>
            <Button onClick={() => router.push('/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Quiz
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              showActions={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteQuizId} onOpenChange={() => setDeleteQuizId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quiz? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}