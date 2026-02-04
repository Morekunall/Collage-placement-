import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import api from '@/utils/api';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      setJob(response.data.data);
    } catch (error) {
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user || user.role !== 'student') {
      toast.error('Please login as a student to apply');
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      await api.post('/students/applications', {
        jobId,
        coverLetter,
      });
      toast.success('Application submitted successfully!');
      navigate('/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
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
            <Link to="/jobs">
              <h1 className="text-xl font-bold">← Back to Jobs</h1>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{job.title}</CardTitle>
            <p className="text-lg text-muted-foreground">{job.company?.companyName}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Package</p>
                <p className="text-xl font-semibold">₹{job.package_lpa} LPA</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-xl font-semibold">{job.location || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Minimum CGPA</p>
                <p className="text-xl font-semibold">{job.min_cgpa || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Application Deadline</p>
                <p className="text-xl font-semibold">
                  {new Date(job.application_deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Eligible Branches</h3>
              <div className="flex flex-wrap gap-2">
                {job.eligible_branches && job.eligible_branches.length > 0 ? (
                  job.eligible_branches.map((branch, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {branch}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">All branches</span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Job Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </div>

            {job.company && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-2">Company Information</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Industry:</strong> {job.company.industry || 'Not specified'}
                </p>
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visit Company Website
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {user?.role === 'student' && (
          <Card>
            <CardHeader>
              <CardTitle>Apply for this Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Cover Letter (Optional)</label>
                  <Textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Write a cover letter..."
                    rows={5}
                  />
                </div>
                <Button onClick={handleApply} disabled={applying} className="w-full">
                  {applying ? 'Applying...' : 'Submit Application'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!user && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground mb-4">
                Please login as a student to apply for this job
              </p>
              <Link to="/login">
                <Button className="w-full">Login</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

