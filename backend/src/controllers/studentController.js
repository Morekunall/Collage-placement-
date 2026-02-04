const pool = require('../config/database');
const resumeParser = require('../utils/resumeParser');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const studentResult = await pool.query(
      `SELECT s.*, u.email
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.user_id = $1`,
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const student = studentResult.rows[0];

    // Get education history
    const educationResult = await pool.query(
      'SELECT * FROM student_education WHERE student_id = $1 ORDER BY end_year DESC',
      [student.id]
    );

    // Get skills
    const skillsResult = await pool.query(
      'SELECT * FROM student_skills WHERE student_id = $1',
      [student.id]
    );

    res.json({
      success: true,
      data: {
        ...student,
        education: educationResult.rows,
        skills: skillsResult.rows
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const studentId = studentResult.rows[0].id;

    await pool.query(
      `UPDATE students
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone = COALESCE($3, phone),
           branch = COALESCE($4, branch),
           cgpa = COALESCE($5, cgpa),
           graduation_year = COALESCE($6, graduation_year),
           github_url = COALESCE($7, github_url),
           linkedin_url = COALESCE($8, linkedin_url),
           updated_at = NOW()
       WHERE id = $9`,
      [
        updateData.firstName,
        updateData.lastName,
        updateData.phone,
        updateData.branch,
        updateData.cgpa,
        updateData.graduationYear,
        updateData.githubUrl,
        updateData.linkedinUrl,
        studentId
      ]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

exports.addEducation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { degree, institution, startYear, endYear, percentage } = req.body;

    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const result = await pool.query(
      `INSERT INTO student_education (student_id, degree, institution, start_year, end_year, percentage)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [studentResult.rows[0].id, degree, institution, startYear, endYear, percentage]
    );

    res.status(201).json({
      success: true,
      message: 'Education added successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add education',
      error: error.message
    });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillName, proficiencyLevel } = req.body;

    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const result = await pool.query(
      `INSERT INTO student_skills (student_id, skill_name, proficiency_level)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [studentResult.rows[0].id, skillName, proficiencyLevel]
    );

    res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add skill',
      error: error.message
    });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    const userId = req.user.id;
    const filePath = req.file.path;

    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const studentId = studentResult.rows[0].id;

    // Parse resume
    let parsedData = null;
    try {
      parsedData = await resumeParser.parseResume(filePath);
      
      // Store parsed data
      await pool.query(
        `INSERT INTO parsed_resume_data (student_id, resume_url, extracted_skills, contact_email, contact_phone, experience_years, raw_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          studentId,
          filePath,
          parsedData.extractedSkills,
          parsedData.contactEmail,
          parsedData.contactPhone,
          parsedData.experienceYears,
          JSON.stringify(parsedData)
        ]
      );
    } catch (parseError) {
      console.error('Resume parsing error:', parseError);
      // Continue even if parsing fails
    }

    // Update student resume URL
    await pool.query(
      'UPDATE students SET resume_url = $1, updated_at = NOW() WHERE id = $2',
      [filePath, studentId]
    );

    res.json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      data: {
        resumeUrl: filePath,
        parsedData: parsedData ? {
          skills: parsedData.extractedSkills,
          contactEmail: parsedData.contactEmail,
          contactPhone: parsedData.contactPhone
        } : null
      }
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      error: error.message
    });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const studentResult = await pool.query(
      'SELECT id FROM students WHERE user_id = $1',
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const result = await pool.query(
      `SELECT a.*, j.title, j.package_lpa, c.company_name, c.id as company_id
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.student_id = $1
       ORDER BY a.applied_at DESC`,
      [studentResult.rows[0].id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId, coverLetter } = req.body;

    const studentResult = await pool.query(
      'SELECT id, resume_url FROM students WHERE user_id = $1',
      [userId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    const studentId = studentResult.rows[0].id;
    const resumeUrl = studentResult.rows[0].resume_url;

    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume before applying'
      });
    }

    // Check if already applied
    const existingApp = await pool.query(
      'SELECT id FROM applications WHERE student_id = $1 AND job_id = $2',
      [studentId, jobId]
    );

    if (existingApp.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Verify job exists and is active
    const jobResult = await pool.query(
      'SELECT id, title, application_deadline FROM jobs WHERE id = $1 AND is_active = true',
      [jobId]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or no longer active'
      });
    }

    const job = jobResult.rows[0];
    const deadline = new Date(job.application_deadline);
    if (deadline < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    const result = await pool.query(
      `INSERT INTO applications (student_id, job_id, resume_url, cover_letter, status)
       VALUES ($1, $2, $3, $4, 'applied')
       RETURNING *`,
      [studentId, jobId, resumeUrl, coverLetter]
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: result.rows[0].id,
        status: result.rows[0].status
      }
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

