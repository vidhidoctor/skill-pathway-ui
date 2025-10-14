import { useState, useEffect } from 'react';
import API from '@/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Enrollment {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    category: string;
  };
  enrollmentDate: string;
  paymentStatus: string;
  progress?: number;
}

const UserDashboard = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data } = await API.get('/orders/user');
      setEnrollments(data);
    } catch (error: any) {
      toast.error('Failed to load enrollments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-transparent py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your learning progress</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold">{enrollments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {enrollments.filter(e => e.progress === 100).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary rounded-lg">
                  <Clock className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">
                    {enrollments.filter(e => (e.progress || 0) < 100).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-6">My Courses</h2>

        {enrollments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">You haven't enrolled in any courses yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <Card key={enrollment._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">
                      {enrollment.courseId.title}
                    </CardTitle>
                    <Badge variant="secondary">{enrollment.courseId.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Enrolled: {formatDate(enrollment.enrollmentDate)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Payment Status:</span>
                      <Badge 
                        variant={enrollment.paymentStatus === 'completed' ? 'default' : 'secondary'}
                      >
                        {enrollment.paymentStatus}
                      </Badge>
                    </div>

                    {enrollment.progress !== undefined && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{enrollment.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        {enrollment.progress === 100 && (
                          <Badge className="mt-2 bg-accent">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
