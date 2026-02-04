const pool = require('../config/database');

exports.getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const branch = req.query.branch;
    const minPackage = req.query.minPackage;
    const search = req.query.search;

    let query = `
      SELECT j.*, c.company_name, c.industry, c.website
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.is_active = true 
        AND j.application_deadline >= CURRENT_DATE
        AND c.is_verified = true
    `;
    const params = [];
    let paramCount = 0;

    if (branch) {
      paramCount++;
      query += ` AND $${paramCount} = ANY(j.eligible_branches)`;
      params.push(branch);
    }

    if (minPackage) {
      paramCount++;
      query += ` AND j.package_lpa >= $${paramCount}`;
      params.push(parseFloat(minPackage));
    }

    if (search) {
      paramCount++;
      query += ` AND (j.title ILIKE $${paramCount} OR j.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY j.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) 
      FROM jobs j
      JOIN companies c ON j.company_id = c.id
      WHERE j.is_active = true 
        AND j.application_deadline >= CURRENT_DATE
        AND c.is_verified = true
    `;
    const countParams = [];
    let countParamCount = 0;

    if (branch) {
      countParamCount++;
      countQuery += ` AND $${countParamCount} = ANY(j.eligible_branches)`;
      countParams.push(branch);
    }

    if (minPackage) {
      countParamCount++;
      countQuery += ` AND j.package_lpa >= $${countParamCount}`;
      countParams.push(parseFloat(minPackage));
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (j.title ILIKE $${countParamCount} OR j.description ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        jobs: result.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
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

exports.getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const result = await pool.query(
      `SELECT j.*, c.company_name, c.industry, c.website, c.description as company_description
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.id = $1 AND j.is_active = true AND c.is_verified = true`,
      [jobId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        company: {
          id: result.rows[0].company_id,
          companyName: result.rows[0].company_name,
          industry: result.rows[0].industry,
          website: result.rows[0].website,
          description: result.rows[0].company_description
        }
      }
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

