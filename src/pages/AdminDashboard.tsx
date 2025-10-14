import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  useEffect(() => {
    fetchData();
    const editId = searchParams.get('edit');
    if (editId) {
      handleEditCourse(editId);
    }
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, usersRes] = await Promise.all([
        API.get('/courses'),
        API.get('/users')
      ]);
      setCourses(coursesRes.data);
      setUsers(usersRes.data);
    } catch (error: any) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = async (id: string) => {
    const course = courses.find(c => c._id === id);
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        description: course.description,
        price: course.price.toString(),
        category: course.category,
        image: course.image || ''
      });
      setShowCourseDialog(true);
      setSearchParams({});
    }
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await API.put(`/courses/${editingCourse._id}`, {
          ...courseForm,
          price: parseFloat(courseForm.price)
        });
        toast.success('Course updated successfully');
      } else {
        await API.post('/courses', {
          ...courseForm,
          price: parseFloat(courseForm.price)
        });
        toast.success('Course created successfully');
      }
      setShowCourseDialog(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await API.delete(`/courses/${id}`);
      toast.success('Course deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to delete course');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await API.delete(`/users/${id}`);
      toast.success('User deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to delete user');
    }
  };

  const handlePromoteToAdmin = async (id: string) => {
    try {
      await API.post('/auth/create-admin', { userId: id });
      toast.success('User promoted to admin');
      fetchData();
    } catch (error: any) {
      toast.error('Failed to promote user');
    }
  };

  const resetForm = () => {
    setCourseForm({
      title: '',
      description: '',
      price: '',
      category: '',
      image: ''
    });
    setEditingCourse(null);
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
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage courses and users</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Courses</h2>
              <Button onClick={() => { resetForm(); setShowCourseDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>₹{course.price}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCourse(course._id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <h2 className="text-2xl font-bold">Manage Users</h2>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={user.role === 'admin' ? 'text-primary font-medium' : ''}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {user.role !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePromoteToAdmin(user._id)}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Promote
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCourse} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                required
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={courseForm.image}
                onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => { setShowCourseDialog(false); resetForm(); }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
