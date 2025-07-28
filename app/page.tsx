import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Star, Users, Clock, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { getFeaturedQuizzes } from '@/lib/storage';
import QuizCard from '@/components/QuizCard';

export default function Home() {
  const featuredQuizzes = getFeaturedQuizzes();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 mb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create & Share Interactive Quizzes
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Build engaging quizzes, share them with the world, and discover amazing content created by others. 
            Perfect for education, entertainment, and team building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/create">
                <Plus className="mr-2 h-5 w-5" />
                Create Quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="/browse">
                <PlayCircle className="mr-2 h-5 w-5" />
                Browse Quizzes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="text-center border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <PlayCircle className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">500+</CardTitle>
            <CardDescription>Quizzes Available</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold">10K+</CardTitle>
            <CardDescription>Quiz Attempts</CardDescription>
          </CardHeader>
        </Card>
        <Card className="text-center border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">4.9/5</CardTitle>
            <CardDescription>Average Rating</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Featured Quizzes */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Quizzes</h2>
            <p className="text-gray-600">Popular quizzes created by our community</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/browse">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Science', 'History', 'Technology', 'Sports', 'Entertainment', 'Literature', 'Misc'].map((category) => (
            <Button
              key={category}
              variant="outline"
              className="h-auto py-4 flex-col hover:bg-blue-50 transition-colors"
              asChild
            >
              <Link href={`/browse?category=${category.toLowerCase()}`}>
                <div className="text-sm font-medium">{category}</div>
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Create Your Quiz?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of educators, trainers, and quiz enthusiasts who use Quizzy
        </p>
        <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
          <Link href="/create">
            Get Started Free
          </Link>
        </Button>
      </section>
    </div>
  );
}