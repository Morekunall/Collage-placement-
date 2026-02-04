const pool = require('../config/database');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const companyResult = await pool.query(
      `SELECT c.*, u.email,
              (SELECT COUNT(*) FROM jobs WHERE company_id = c.id AND is_active = true) as active_jobs_count
       FROM companies c
       JOIN users u ON c.user_id = u.id
       WHERE c.user_id = $1`,
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    res.json({
      success: true,
      data: companyResult.rows[0]
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

    await pool.query(
      `UPDATE companies
       SET company_name = COALESCE($1, company_name),
           industry = COALESCE($2, industry),
           website = COALESCE($3, website),
           description = COALESCE($4, description),
           address = COALESCE($5, address),
           phone = COALESCE($6, phone),
           updated_at = NOW()
       WHERE user_id = $7`,
      [
        updateData.companyName,
        updateData.industry,
        updateData.website,
        updateData.description,
        updateData.address,
        updateData.phone,
        userId
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

exports.getJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const companyResult = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const result = await pool.query(
      `SELECT j.*,
              (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applications_count
       FROM jobs j
       WHERE j.company_id = $1
       ORDER BY j.created_at DESC`,
      [companyResult.rows[0].id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

exports.createJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      packageLpa,
      minCgpa,
      eligibleBranches,
      location,
      jobType,
      applicationDeadline
    } = req.body;

    const companyResult = await pool.query(
      'SELECT id, is_verified FROM companies WHERE user_id = $1',
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    if (!companyResult.rows[0].is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Company must be verified by admin before posting jobs'
      });
    }

    const result = await pool.query(
      `INSERT INTO jobs (company_id, title, description, package_lpa, min_cgpa, eligible_branches, location, job_type, application_deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        companyResult.rows[0].id,
        title,
        description,
        packageLpa,
        minCgpa,
        eligibleBranches,
        location,
        jobType,
        applicationDeadline
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: {
        jobId: result.rows[0].id,
        title: result.rows[0].title
      }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;
    const updateData = req.body;

    const companyResult = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const jobResult = await pool.query(
      'SELECT id FROM jobs WHERE id = $1 AND company_id = $2',
      [jobId, companyResult.rows[0].id]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or access denied'
      });
    }

    await pool.query(
      `UPDATE jobs
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           package_lpa = COALESCE($3, package_lpa),
           min_cgpa = COALESCE($4, min_cgpa),
           eligible_branches = COALESCE($5, eligible_branches),
           location = COALESCE($6, location),
           job_type = COALESCE($7, job_type),
           application_deadline = COALESCE($8, application_deadline),
           updated_at = NOW()
       WHERE id = $9`,
      [
        updateData.title,
        updateData.description,
        updateData.packageLpa,
        updateData.minCgpa,
        updateData.eligibleBranches,
        updateData.location,
        updateData.jobType,
        updateData.applicationDeadline,
        jobId
      ]
    );

    res.json({
      success: true,
      message: 'Job updated successfully'
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    const companyResult = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const result = await pool.query(
      'UPDATE jobs SET is_active = false, updated_at = NOW() WHERE id = $1 AND company_id = $2 RETURNING *',
      [jobId, companyResult.rows[0].id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or access denied'
      });
    }

    res.json({
      success: true,
      message: 'Job closed successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to close job',
      error: error.message
    });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.jobId;

    const companyResult = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const jobResult = await pool.query(
      'SELECT id FROM jobs WHERE id = $1 AND company_id = $2',
      [jobId, companyResult.rows[0].id]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or access denied'
      });
    }

    const result = await pool.query(
      `SELECT a.*, s.first_name, s.last_name, s.enrollment_number, s.cgpa, s.branch, s.resume_url
       FROM applications a
       JOIN students s ON a.student_id = s.id
       WHERE a.job_id = $1
       ORDER BY a.applied_at DESC`,
      [jobId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId, applicationId } = req.params;
    const { status } = req.body;

    if (!['applied', 'shortlisted', 'interviewing', 'selected', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const companyResult = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company profile not found'
      });
    }

    const jobResult = await pool.query(
      'SELECT id, title FROM jobs WHERE id = $1 AND company_id = $2',
      [jobId, companyResult.rows[0].id]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or access denied'
      });
    }

    const applicationResult = await pool.query(
      'SELECT student_id FROM applications WHERE id = $1 AND job_id = $2',
      [applicationId, jobId]
    );

    if (applicationResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await pool.query(
      'UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2',
      [status, applicationId]
    );

    // Update student placement status if selected
    if (status === 'selected') {
      await pool.query(
        'UPDATE students SET is_placed = true, updated_at = NOW() WHERE id = $1',
        [applicationResult.rows[0].student_id]
      );
    }

    // Send notification
    const notificationService = require('../utils/notificationService');
    await notificationService.notifyApplicationStatusUpdate(
      applicationResult.rows[0].student_id,
      jobId,
      status,
      jobResult.rows[0].title
    );

    res.json({
      success: true,
      message: 'Application status updated',
      data: {
        applicationId,
        newStatus: status
      }
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
};

