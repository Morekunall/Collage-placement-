const pool = require('../config/database');

exports.getDashboard = async (req, res) => {
  try {
    // Get placement statistics
    const placementStats = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE is_placed = true) as placed_students,
        COUNT(*) FILTER (WHERE is_placed = false) as unplaced_students,
        COUNT(*) as total_students
       FROM students`
    );

    // Get company statistics
    const companyStats = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE is_verified = true) as verified_companies,
        COUNT(*) FILTER (WHERE is_verified = false) as pending_companies,
        COUNT(*) as total_companies
       FROM companies`
    );

    // Get job statistics
    const jobStats = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE is_active = true) as active_jobs,
        COUNT(*) as total_jobs
       FROM jobs`
    );

    // Get application statistics
    const applicationStats = await pool.query(
      'SELECT COUNT(*) as total_applications FROM applications'
    );

    res.json({
      success: true,
      data: {
        totalStudents: parseInt(placementStats.rows[0].total_students),
        placedStudents: parseInt(placementStats.rows[0].placed_students),
        unplacedStudents: parseInt(placementStats.rows[0].unplaced_students),
        totalCompanies: parseInt(companyStats.rows[0].total_companies),
        verifiedCompanies: parseInt(companyStats.rows[0].verified_companies),
        pendingCompanies: parseInt(companyStats.rows[0].pending_companies),
        activeJobs: parseInt(jobStats.rows[0].active_jobs),
        totalJobs: parseInt(jobStats.rows[0].total_jobs),
        totalApplications: parseInt(applicationStats.rows[0].total_applications)
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

exports.getPendingCompanies = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.email, u.created_at as registered_at
       FROM companies c
       JOIN users u ON c.user_id = u.id
       WHERE c.is_verified = false
       ORDER BY u.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Get pending companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending companies',
      error: error.message
    });
  }
};

exports.verifyCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const adminId = req.user.id;

    const result = await pool.query(
      `UPDATE companies
       SET is_verified = true,
           verified_by = $1,
           verified_at = NOW(),
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [adminId, companyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company verified successfully'
    });
  } catch (error) {
    console.error('Verify company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify company',
      error: error.message
    });
  }
};

exports.rejectCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { reason } = req.body;

    // Optionally, you could delete the company or mark it as rejected
    // For now, we'll just delete it
    const result = await pool.query(
      'DELETE FROM companies WHERE id = $1 RETURNING *',
      [companyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.json({
      success: true,
      message: 'Company registration rejected'
    });
  } catch (error) {
    console.error('Reject company error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject company',
      error: error.message
    });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const branch = req.query.branch;
    const isPlaced = req.query.isPlaced;

    let query = `
      SELECT s.*, u.email,
             (SELECT COUNT(*) FROM applications WHERE student_id = s.id) as applications_count
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (branch) {
      paramCount++;
      query += ` AND s.branch = $${paramCount}`;
      params.push(branch);
    }

    if (isPlaced !== undefined) {
      paramCount++;
      query += ` AND s.is_placed = $${paramCount}`;
      params.push(isPlaced === 'true');
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM students s WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (branch) {
      countParamCount++;
      countQuery += ` AND s.branch = $${countParamCount}`;
      countParams.push(branch);
    }

    if (isPlaced !== undefined) {
      countParamCount++;
      countQuery += ` AND s.is_placed = $${countParamCount}`;
      countParams.push(isPlaced === 'true');
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        students: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

