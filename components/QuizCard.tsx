import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Clock, Users, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Quiz } from '@/types/quiz';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface QuizCardProps {
  quiz: Quiz;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export default function QuizCard({ 
  quiz, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onDuplicate 
}: QuizCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-none bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {quiz.category}
              </Badge>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-3 w-3 mr-1" />
                {quiz.questions.length * 30}s
              </div>
            </div>
            <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
              {quiz.title}
            </CardTitle>
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(quiz.id)}>
                  Edit Quiz
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(quiz.id)}>
                  Duplicate Quiz
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(quiz.id)}
                  className="text-red-600"
                >
                  Delete Quiz
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-sm text-gray-600">
          {quiz.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {quiz.attempts || 0} attempts
          </div>
          <div>
            {quiz.questions.length} questions
          </div>
        </div>
        <Button className="w-full group-hover:bg-blue-600 transition-colors" asChild>
          <Link href={`/quiz/${quiz.id}`}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Start Quiz
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}