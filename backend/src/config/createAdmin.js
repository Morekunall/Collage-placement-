const bcrypt = require('bcryptjs');
const pool = require('./database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  try {
    rl.question('Enter admin email: ', async (email) => {
      rl.question('Enter admin password: ', async (password) => {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
          `INSERT INTO users (email, password, role, is_active, is_verified)
           VALUES ($1, $2, 'admin', true, true)
           RETURNING id, email, role`,
          [email, hashedPassword]
        );

        console.log('Admin user created successfully!');
        console.log('User:', result.rows[0]);
        rl.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();


