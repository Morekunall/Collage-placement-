const pool = require('../config/database');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    // Email transporter setup (configure in production)
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async createNotification(userId, type, title, message, relatedId = null) {
    try {
      const result = await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, related_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, type, title, message, relatedId]
      );

      // Send email notification if configured
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await this.sendEmailNotification(userId, title, message);
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async sendEmailNotification(userId, title, message) {
    try {
      const userResult = await pool.query(
        'SELECT email FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) return;

      const email = userResult.rows[0].email;

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: title,
        text: message,
        html: `<p>${message}</p>`
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't throw - email failure shouldn't break the app
    }
  }

  async notifyApplicationStatusUpdate(studentId, jobId, status, jobTitle) {
    const statusMessages = {
      'shortlisted': 'Your application has been shortlisted',
      'interviewing': 'You have been selected for an interview',
      'selected': 'Congratulations! You have been selected',
      'rejected': 'Your application status has been updated'
    };

    const title = 'Application Status Updated';
    const message = `${statusMessages[status] || 'Your application status has been updated'} for the position: ${jobTitle}`;

    return await this.createNotification(
      studentId,
      'application_status_update',
      title,
      message,
      jobId
    );
  }
}

module.exports = new NotificationService();

