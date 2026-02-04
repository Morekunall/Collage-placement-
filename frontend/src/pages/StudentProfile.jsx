import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/utils/api';
import { toast } from 'sonner';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/students/profile');
      setProfile(response.data.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/students/profile', {
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        branch: profile.branch,
        cgpa: profile.cgpa,
        graduationYear: profile.graduation_year,
        githubUrl: profile.github_url,
        linkedinUrl: profile.linkedin_url,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('word')) {
      toast.error('Please upload a PDF or DOCX file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/students/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Resume uploaded successfully');
      if (response.data.data.parsedData) {
        toast.info('Resume parsed! Skills extracted: ' + response.data.data.parsedData.skills?.join(', '));
      }
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const education = {
      degree: formData.get('degree'),
      institution: formData.get('institution'),
      startYear: parseInt(formData.get('startYear')),
      endYear: formData.get('endYear') ? parseInt(formData.get('endYear')) : null,
      percentage: formData.get('percentage') ? parseFloat(formData.get('percentage')) : null,
    };

    try {
      await api.post('/students/education', education);
      toast.success('Education added successfully');
      e.target.reset();
      fetchProfile();
    } catch (error) {
      toast.error('Failed to add education');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const skill = {
      skillName: formData.get('skillName'),
      proficiencyLevel: formData.get('proficiencyLevel'),
    };

    try {
      await api.post('/students/skills', skill);
      toast.success('Skill added successfully');
      e.target.reset();
      fetchProfile();
    } catch (error) {
      toast.error('Failed to add skill');
    }
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
              <Button variant="outline" onClick={() => navigate('/student/dashboard')}>
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile?.first_name || ''}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile?.last_name || ''}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile?.email || ''} disabled />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile?.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={profile?.branch || ''}
                    onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cgpa">CGPA</Label>
                  <Input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={profile?.cgpa || ''}
                    onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    type="url"
                    value={profile?.github_url || ''}
                    onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={profile?.linkedin_url || ''}
                    onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                  />
                </div>
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile?.resume_url ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Resume uploaded</p>
                  <a
                    href={`http://localhost:5000/${profile.resume_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Resume
                  </a>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No resume uploaded</p>
              )}
              <div>
                <Label htmlFor="resume">Upload Resume (PDF/DOCX)</Label>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Education History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile?.education?.map((edu) => (
                <div key={edu.id} className="border-b pb-4">
                  <h4 className="font-semibold">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">
                    {edu.start_year} - {edu.end_year || 'Present'} | {edu.percentage}%
                  </p>
                </div>
              ))}
              <form onSubmit={handleAddEducation} className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="degree">Degree</Label>
                    <Input id="degree" name="degree" required />
                  </div>
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input id="institution" name="institution" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startYear">Start Year</Label>
                    <Input id="startYear" name="startYear" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="endYear">End Year</Label>
                    <Input id="endYear" name="endYear" type="number" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="percentage">Percentage</Label>
                  <Input id="percentage" name="percentage" type="number" step="0.01" />
                </div>
                <Button type="submit" size="sm">Add Education</Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {profile?.skills?.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill.skill_name}
                    {skill.proficiency_level && ` (${skill.proficiency_level})`}
                  </span>
                ))}
              </div>
              <form onSubmit={handleAddSkill} className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="skillName">Skill Name</Label>
                    <Input id="skillName" name="skillName" required />
                  </div>
                  <div>
                    <Label htmlFor="proficiencyLevel">Proficiency Level</Label>
                    <select
                      id="proficiencyLevel"
                      name="proficiencyLevel"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" size="sm">Add Skill</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

