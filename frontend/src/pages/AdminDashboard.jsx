import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/utils/api';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import { LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, companiesRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/companies/pending'),
      ]);
      setStats(statsRes.data.data);
      setPendingCompanies(companiesRes.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCompany = async (companyId) => {
    try {
      await api.post(`/admin/companies/${companyId}/verify`);
      toast.success('Company verified successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify company');
    }
  };

  const handleRejectCompany = async (companyId) => {
    if (!confirm('Are you sure you want to reject this company?')) return;

    try {
      await api.post(`/admin/companies/${companyId}/reject`, { reason: 'Rejected by admin' });
      toast.success('Company rejected');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject company');
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
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalStudents || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Placed Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{stats?.placedStudents || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Unplaced Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">{stats?.unplacedStudents || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.activeJobs || 0}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">Total: <span className="font-semibold">{stats?.totalCompanies || 0}</span></p>
                <p className="text-sm">Verified: <span className="font-semibold text-green-600">{stats?.verifiedCompanies || 0}</span></p>
                <p className="text-sm">Pending: <span className="font-semibold text-yellow-600">{stats?.pendingCompanies || 0}</span></p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalApplications || 0}</p>
            </CardContent>
          </Card>
        </div>

        {pendingCompanies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Company Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingCompanies.map((company) => (
                  <div key={company.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{company.company_name}</h3>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                        <p className="text-sm text-muted-foreground">{company.website}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Registered: {new Date(company.registered_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleVerifyCompany(company.id)}
                        >
                          Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectCompany(company.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

