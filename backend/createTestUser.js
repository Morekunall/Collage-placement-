const bcrypt = require('bcryptjs');
const pool = require('./src/config/database');

async function createTestUser() {
  try {
    const email = 'test@student.edu';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, role, is_active, is_verified)
       VALUES ($1, $2, 'student', true, true)
       RETURNING id, email, role`,
      [email, hashedPassword]
    );

    // Create student profile
    await pool.query(
      `INSERT INTO students (user_id, first_name, last_name)
       VALUES ($1, 'Test', 'Student')`,
      [result.rows[0].id]
    );

    console.log('Test user created successfully!');
    console.log('Email: test@student.edu');
    console.log('Password: password123');
    console.log('Role: student');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
