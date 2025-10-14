import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

const Checkout = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // In production, integrate with Razorpay/Stripe
      // For now, simulate payment success
      const { data } = await API.post('/orders', {
        courseId: id,
        amount: course?.price,
        paymentMethod: 'card'
      });

      toast.success('Payment successful! Check your email for confirmation.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Course Price</span>
                      <span className="font-medium">₹{course.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">₹0</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{course.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-6 bg-secondary/50 rounded-lg text-center">
                    <p className="text-muted-foreground mb-4">
                      Payment gateway integration coming soon
                    </p>
                    <p className="text-sm text-muted-foreground">
                      (Razorpay/Stripe integration required)
                    </p>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePayment}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : `Pay ₹${course.price}`}
                  </Button>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>Instant course access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>Email confirmation</span>
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

export default Checkout;
