import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
      <div className="aspect-video bg-muted overflow-hidden">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
          <Badge variant="secondary" className="shrink-0">{course.category}</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between">
        <span className="text-2xl font-bold text-primary">₹{course.price}</span>
        <Button onClick={() => navigate(`/course/${course._id}`)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
