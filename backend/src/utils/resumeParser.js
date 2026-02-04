const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

class ResumeParser {
  async parseResume(filePath) {
    const ext = filePath.toLowerCase().split('.').pop();
    
    try {
      let text = '';
      
      if (ext === 'pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        text = data.text;
      } else if (ext === 'docx' || ext === 'doc') {
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
      } else {
        throw new Error('Unsupported file format');
      }

      return this.extractData(text);
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw new Error('Failed to parse resume: ' + error.message);
    }
  }

  extractData(text) {
    const data = {
      extractedSkills: [],
      contactEmail: null,
      contactPhone: null,
      experienceYears: 0,
      rawText: text
    };

    // Extract email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailRegex);
    if (emails && emails.length > 0) {
      data.contactEmail = emails[0];
    }

    // Extract phone
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = text.match(phoneRegex);
    if (phones && phones.length > 0) {
      data.contactPhone = phones[0];
    }

    // Extract skills (common tech skills)
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Express',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Git', 'Docker', 'AWS', 'Linux',
      'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue.js', 'Django', 'Flask',
      'Spring Boot', 'REST API', 'GraphQL', 'Redis', 'Kubernetes', 'CI/CD'
    ];

    const textLower = text.toLowerCase();
    commonSkills.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        data.extractedSkills.push(skill);
      }
    });

    // Extract experience years
    const experienceRegex = /(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/gi;
    const expMatch = text.match(experienceRegex);
    if (expMatch) {
      const yearsMatch = expMatch[0].match(/\d+/);
      if (yearsMatch) {
        data.experienceYears = parseInt(yearsMatch[0]);
      }
    }

    return data;
  }
}

module.exports = new ResumeParser();

