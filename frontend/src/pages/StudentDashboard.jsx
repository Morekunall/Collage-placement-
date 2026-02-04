import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Notifications from '@/components/Notifications';
import api from '@/utils/api';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { LogOut, Bell } from 'lucide-react';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, applicationsRes] = await Promise.all([
        api.get('/students/profile'),
        api.get('/students/applications'),
      ]);
      setProfile(profileRes.data.data);
      setApplications(applicationsRes.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Campus Placement Portal</h1>
            <div className="flex gap-4">
              <Link to="/jobs">
                <Button variant="outline">Browse Jobs</Button>
              </Link>
              <Link to="/student/profile">
                <Button variant="outline">Profile</Button>
              </Link>
              <Button variant="ghost" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {profile?.resume_url ? 'Resume uploaded' : 'Resume pending'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{applications.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Placement Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {profile?.is_placed ? (
                  <span className="text-green-600 font-semibold">Placed</span>
                ) : (
                  <span className="text-gray-600">Not Placed</span>
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-muted-foreground">No applications yet</p>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{app.title}</h3>
                        <p className="text-sm text-muted-foreground">{app.company_name}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          app.status === 'selected'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {showNotifications && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Notifications />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


