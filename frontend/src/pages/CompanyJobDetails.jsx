import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/utils/api';
import { toast } from 'sonner';

export default function CompanyJobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/jobs/${jobId}`),
        api.get(`/companies/jobs/${jobId}/applications`),
      ]);
      setJob(jobRes.data.data);
      setApplications(appsRes.data.data);
    } catch (error) {
      toast.error('Failed to load job details');
      navigate('/company/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await api.put(`/companies/jobs/${jobId}/applications/${applicationId}/status`, {
        status: newStatus,
      });
      toast.success('Application status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/company/dashboard">
              <h1 className="text-xl font-bold">← Back to Dashboard</h1>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{job.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Package</p>
                <p className="text-xl font-semibold">₹{job.package_lpa} LPA</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-xl font-semibold">{applications.length}</p>
              </div>
            </div>
            <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications ({applications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-muted-foreground">No applications yet</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {app.first_name} {app.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Enrollment: {app.enrollment_number} | CGPA: {app.cgpa} | Branch: {app.branch}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Applied: {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                        {app.resume_url && (
                          <a
                            href={`http://localhost:5000/${app.resume_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                          >
                            View Resume
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            app.status === 'selected'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : app.status === 'shortlisted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {app.status}
                        </span>
                        <div className="flex gap-2">
                          {app.status === 'applied' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                              >
                                Shortlist
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(app.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {app.status === 'shortlisted' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(app.id, 'interviewing')}
                              >
                                Interview
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(app.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {app.status === 'interviewing' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(app.id, 'selected')}
                              >
                                Select
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(app.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

