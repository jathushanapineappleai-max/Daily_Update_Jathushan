const Joi = require('joi');

// Validation for personal information
const personalInfoSchema = Joi.object({
  first_name: Joi.string().min(1).max(50).required(),
  last_name: Joi.string().min(1).max(50).optional().allow(null, ''),
  email: Joi.string().email().required(),
  emp_id: Joi.string().min(1).max(20).required(),
  gender: Joi.string().valid('male', 'female', 'other').optional().allow(null),
  dob: Joi.date().iso().optional().allow(null),
  phone: Joi.string().min(1).max(20).optional().allow(null, ''),
  address: Joi.string().optional().allow(null, ''),
  password: Joi.string().min(6).required()
});

// Validation for educational information
const educationSchema = Joi.object({
  qualification: Joi.string().min(1).max(100).required(),
  institution: Joi.string().min(1).max(150).required(),
  year_of_completion: Joi.number().integer().min(1900).max(2100).required()
});

// Validation for professional information
const professionalSchema = Joi.object({
  position: Joi.string().min(1).max(100).required(),
  company_name: Joi.string().min(1).max(150).required(),
  years_of_experience: Joi.number().min(0).max(50).required()
});

// Validation for work information
const workInfoSchema = Joi.object({
  joined_date: Joi.date().iso().required(),
  designation: Joi.string().min(1).max(100).required(),
  department_id: Joi.number().integer().positive().optional().allow(null),
  management_role: Joi.string().min(1).max(100).optional().allow(null, ''),
  report_to: Joi.number().integer().positive().optional().allow(null)
});

// Validation for document upload
const documentSchema = Joi.object({
  document_type: Joi.string().valid('nic', 'birth_certificate', 'educational_certificate', 'transcript').required()
});

module.exports = {
  personalInfoSchema,
  educationSchema,
  professionalSchema,
  workInfoSchema,
  documentSchema
};