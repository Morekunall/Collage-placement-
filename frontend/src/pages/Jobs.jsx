import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/utils/api';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const fetchJobs = useCallback(async (searchTerm = '') => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      const response = await api.get('/jobs', { params });
      if (response.data?.success && response.data?.data?.jobs) {
        setJobs(response.data.data.jobs);
      } else {
        setJobs([]);
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setError(error.response?.data?.message || 'Failed to load jobs. Please try again.');
      toast.error(error.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs('');
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(search);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Campus Placement Portal</h1>
            <div className="flex gap-4 items-center">
              {user ? (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {user.email} ({user.role})
                  </span>
                  {user.role === 'student' && (
                    <Link to="/student/dashboard">
                      <Button variant="outline">Dashboard</Button>
                    </Link>
                  )}
                  {user.role === 'company' && (
                    <Link to="/company/dashboard">
                      <Button variant="outline">Dashboard</Button>
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard">
                      <Button variant="outline">Dashboard</Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      useAuthStore.getState().logout();
                      toast.success('Logged out successfully');
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search jobs by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            {search && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearch('');
                  fetchJobs('');
                }}
              >
                Clear
              </Button>
            )}
          </form>
        </div>

        {loading && jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchJobs(search)}>Retry</Button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">
              {search ? `No jobs found matching "${search}"` : 'No jobs available at the moment'}
            </p>
            {search && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  fetchJobs('');
                }}
                className="mt-4"
              >
                View All Jobs
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Found {jobs.length} job{jobs.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{job.company_name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="font-semibold">Package:</span> ₹{job.package_lpa} LPA
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Location:</span> {job.location || 'N/A'}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Deadline:</span>{' '}
                        {new Date(job.application_deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <Link to={`/jobs/${job.id}`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


