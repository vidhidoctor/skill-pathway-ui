import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Users, Star, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

const CourseDetails = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await API.get(`/courses/${id}`);
      setCourse(data);
    } catch (error: any) {
      toast.error('Failed to load course');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    if (!user) {
      toast.error('Please login to enroll');
      navigate('/login');
      return;
    }
    navigate(`/checkout/${id}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await API.delete(`/courses/${id}`);
      toast.success('Course deleted successfully');
      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge className="mb-4">{course.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent fill-accent" />
                  <span className="font-medium">4.8 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>1,234 Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>12 hours</span>
                </div>
              </div>

              {course.image && (
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full rounded-lg shadow-lg mb-6"
                />
              )}

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                      <span>Master the fundamentals of {course.category}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                      <span>Build real-world projects</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                      <span>Learn industry best practices</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-20">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-6">₹{course.price}</div>
                  
                  {user ? (
                    isAdmin ? (
                      <div className="space-y-2">
                        <Button className="w-full" onClick={() => navigate(`/admin/dashboard?edit=${id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Course
                        </Button>
                        <Button variant="destructive" className="w-full" onClick={handleDelete}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Course
                        </Button>
                      </div>
                    ) : (
                      <Button className="w-full" size="lg" onClick={handleEnroll}>
                        Enroll Now
                      </Button>
                    )
                  ) : (
                    <Button className="w-full" size="lg" onClick={handleEnroll}>
                      Login to Enroll
                    </Button>
                  )}

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
