'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { getAllQuizzes } from '@/lib/storage';
import { Quiz } from '@/types/quiz';
import QuizCard from '@/components/QuizCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = ['All', 'Science', 'History', 'Technology', 'Sports', 'Entertainment', 'Literature', 'Education', 'Health', 'Misc'];

export default function BrowsePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const allQuizzes = getAllQuizzes();
    setQuizzes(allQuizzes);
    setFilteredQuizzes(allQuizzes);
  }, []);

  useEffect(() => {
    let filtered = quizzes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(quiz => quiz.category === selectedCategory);
    }

    setFilteredQuizzes(filtered);
  }, [quizzes, searchTerm, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Discover Quizzes</h1>
        <p className="text-gray-600 text-lg">
          Browse through thousands of quizzes created by our community
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
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

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredQuizzes.length} of {quizzes.length} quizzes
        </p>
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No quizzes found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse all categories
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}>
              Clear Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}