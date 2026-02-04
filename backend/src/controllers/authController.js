const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, role, ...profileData } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and role are required'
      });
    }

    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Only student and company can register.'
      });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await pool.query(
      `INSERT INTO users (email, password, role, is_verified)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, role`,
      [email, hashedPassword, role, role === 'company' ? false : true]
    );

    const user = userResult.rows[0];

    // Create role-specific profile
    if (role === 'student') {
      await pool.query(
        `INSERT INTO students (user_id, first_name, last_name, enrollment_number, branch, cgpa)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          user.id,
          profileData.firstName || '',
          profileData.lastName || '',
          profileData.enrollmentNumber || null,
          profileData.branch || null,
          profileData.cgpa || null
        ]
      );
    } else if (role === 'company') {
      await pool.query(
        `INSERT INTO companies (user_id, company_name, industry, website)
         VALUES ($1, $2, $3, $4)`,
        [
          user.id,
          profileData.companyName || '',
          profileData.industry || null,
          profileData.website || null
        ]
      );
    }

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const userResult = await pool.query(
      'SELECT id, email, password, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

