import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/utils/api';
import { toast } from 'sonner';

export default function CreateJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    packageLpa: '',
    minCgpa: '',
    eligibleBranches: [],
    location: '',
    jobType: 'full-time',
    applicationDeadline: '',
  });
  const [branchInput, setBranchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddBranch = () => {
    if (branchInput.trim() && !formData.eligibleBranches.includes(branchInput.trim())) {
      setFormData({
        ...formData,
        eligibleBranches: [...formData.eligibleBranches, branchInput.trim()],
      });
      setBranchInput('');
    }
  };

  const handleRemoveBranch = (branch) => {
    setFormData({
      ...formData,
      eligibleBranches: formData.eligibleBranches.filter((b) => b !== branch),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/companies/jobs', {
        ...formData,
        packageLpa: formData.packageLpa ? parseFloat(formData.packageLpa) : null,
        minCgpa: formData.minCgpa ? parseFloat(formData.minCgpa) : null,
      });
      toast.success('Job posted successfully!');
      navigate('/company/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">Campus Placement Portal</h1>
            <Button variant="outline" onClick={() => navigate('/company/dashboard')}>
              Cancel
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Post New Job</h2>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="packageLpa">Package (LPA)</Label>
                  <Input
                    id="packageLpa"
                    name="packageLpa"
                    type="number"
                    step="0.1"
                    value={formData.packageLpa}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="minCgpa">Minimum CGPA</Label>
                  <Input
                    id="minCgpa"
                    name="minCgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.minCgpa}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <select
                    id="jobType"
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="eligibleBranches">Eligible Branches</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={branchInput}
                    onChange={(e) => setBranchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBranch())}
                    placeholder="Enter branch name"
                  />
                  <Button type="button" onClick={handleAddBranch} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.eligibleBranches.map((branch) => (
                    <span
                      key={branch}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                    >
                      {branch}
                      <button
                        type="button"
                        onClick={() => handleRemoveBranch(branch)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="applicationDeadline">Application Deadline *</Label>
                <Input
                  id="applicationDeadline"
                  name="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Posting...' : 'Post Job'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/company/dashboard')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

