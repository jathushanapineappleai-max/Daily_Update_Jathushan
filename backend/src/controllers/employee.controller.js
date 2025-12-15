const { User, EmployeeDetail, EmployeeHistory, Document, Department } = require('../models');
const { upload } = require('../utils/fileUpload');
const { personalInfoSchema, educationSchema, professionalSchema, workInfoSchema } = require('../validators/employee.validation');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Utility function to handle errors
const handleControllerError = (error, operation) => {
  console.error(`${operation} error:`, error);
  return {
    success: false,
    message: `Server error during ${operation}`,
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  };
};

// @desc    Create employee - Step 1: Personal Information & Credentials
// @route   POST /api/employees/personal
// @access  Private (Admin)
exports.createEmployeePersonal = async (req, res) => {
  try {
    // Validate input
    const { error } = personalInfoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    const { first_name, last_name, email, emp_id, gender, dob, phone, address, password } = req.body;

    // Check if employee already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { emp_id: emp_id }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this email or employee ID already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      first_name,
      last_name: last_name || null,
      email,
      emp_id,
      password_hash,
      role: 'employee',
      status: 'active'
    });

    // Create employee detail
    await EmployeeDetail.create({
      user_id: user.id,
      gender: gender || null,
      dob: dob || null,
      phone: phone || null,
      address: address || null,
      image_path: null // Will be updated when image is uploaded
    });

    res.status(201).json({
      success: true,
      message: 'Employee personal information created successfully',
      data: {
        user_id: user.id
      }
    });
  } catch (error) {
    const errorResponse = handleControllerError(error, 'create employee personal info');
    res.status(500).json(errorResponse);
  }
};

// @desc    Update employee - Step 1: Personal Information & Credentials
// @route   PUT /api/employees/:id/personal
// @access  Private (Admin)
exports.updateEmployeePersonal = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate input
    const { error } = personalInfoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    const { first_name, last_name, email, emp_id, gender, dob, phone, address, password } = req.body;

    // Get current user to check their existing email and emp_id
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if another employee already has this email or emp_id (excluding current user)
    let whereClause = {
      [Op.or]: [
        { email: email },
        { emp_id: emp_id }
      ]
    };

    // Exclude current user from the check
    whereClause.id = { [Op.ne]: userId };

    const existingUser = await User.findOne({
      where: whereClause
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Another employee with this email or employee ID already exists'
      });
    }

    // Update password if provided
    let password_hash = currentUser.password_hash;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    }

    // Update user
    await currentUser.update({
      first_name,
      last_name: last_name || null,
      email,
      emp_id,
      password_hash
    });

    // Get or create employee detail
    let employeeDetail = await EmployeeDetail.findOne({ where: { user_id: userId } });
    if (!employeeDetail) {
      employeeDetail = await EmployeeDetail.create({
        user_id: userId,
        gender: gender || null,
        dob: dob || null,
        phone: phone || null,
        address: address || null
      });
    } else {
      await employeeDetail.update({
        gender: gender || null,
        dob: dob || null,
        phone: phone || null,
        address: address || null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee personal information updated successfully',
      data: {
        user: currentUser
      }
    });
  } catch (error) {
    const errorResponse = handleControllerError(error, 'update employee personal info');
    res.status(500).json(errorResponse);
  }
};

// @desc    Add employee educational information
// @route   POST /api/employees/:id/education
// @access  Private (Admin)
exports.addEmployeeEducation = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate input
    const { error } = educationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const { qualification, institution, year_of_completion } = req.body;

    // Create education record
    const education = await EmployeeHistory.create({
      user_id: userId,
      type: 'education',
      qualification,
      institution,
      year_of_completion
    });

    res.status(201).json({
      success: true,
      message: 'Employee education information added successfully',
      data: {
        education
      }
    });
  } catch (error) {
    const errorResponse = handleControllerError(error, 'add employee education');
    res.status(500).json(errorResponse);
  }
};

// @desc    Add employee professional information
// @route   POST /api/employees/:id/professional
// @access  Private (Admin)
exports.addEmployeeProfessional = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate input
    const { error } = professionalSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const { position, company_name, years_of_experience } = req.body;

    // Create professional record
    const professional = await EmployeeHistory.create({
      user_id: userId,
      type: 'experience',
      position,
      company_name,
      years_of_experience
    });

    res.status(201).json({
      success: true,
      message: 'Employee professional information added successfully',
      data: {
        professional
      }
    });
  } catch (error) {
    const errorResponse = handleControllerError(error, 'add employee professional');
    res.status(500).json(errorResponse);
  }
};

// @desc    Upload employee document
// @route   POST /api/employees/:id/documents
// @access  Private (Admin)
exports.uploadEmployeeDocument = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const documentType = req.body.document_type;
    
    // Validate document type
    if (!['nic', 'birth_certificate', 'educational_certificate', 'transcript'].includes(documentType)) {
      // Delete uploaded file
      const { deleteFile } = require('../utils/fileUpload');
      deleteFile(req.file.path);
      
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }

    // Create document record
    const document = await Document.create({
      user_id: userId,
      document_type: documentType,
      file_path: req.file.path
    });

    res.status(201).json({
      success: true,
      message: 'Employee document uploaded successfully',
      data: {
        document
      }
    });
  } catch (error) {
    const errorResponse = handleControllerError(error, 'upload employee document');
    res.status(500).json(errorResponse);
  }
};

// @desc    Set employee work information
// @route   POST /api/employees/:id/work-info
// @access  Private (Admin)
exports.setEmployeeWorkInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Validate input
    const { error } = workInfoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const { joined_date, designation, department_id, management_role, report_to } = req.body;

    // Check if department exists (only if department_id is provided)
    if (department_id) {
      const department = await Department.findByPk(department_id);
      if (!department) {
        return res.status(400).json({
          success: false,
          message: 'Department not found'
        });
      }
    }

    // Update user with work information
    await user.update({
      department_id,
      designation,
      report_to: report_to || null
    });

    // Update employee detail with joined date
    let employeeDetail = await EmployeeDetail.findOne({ where: { user_id: userId } });
    if (employeeDetail) {
      await employeeDetail.update({
        joined_date
      });
    } else {
      await EmployeeDetail.create({
        user_id: userId,
        joined_date
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee work information set successfully',
      data: {
        user
      }
    });
  } catch (error) {
    const errorResponse = handleControllerError(error, 'set employee work info');
    res.status(500).json(errorResponse);
  }
};

// @desc    Get employee overview
// @route   GET /api/employees/:id
// @access  Private (Admin/Employee)
exports.getEmployeeOverview = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user with associated data
    const user = await User.findByPk(userId, {
      include: [
        {
          model: EmployeeDetail,
          as: 'EmployeeDetail'
        },
        {
          model: EmployeeHistory,
          as: 'EmployeeHistories'
        },
        {
          model: Document,
          as: 'Documents'
        },
        {
          model: Department,
          as: 'Department'
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Separate education and professional experience
    const education = user.EmployeeHistories.filter(history => history.type === 'education');
    const professional = user.EmployeeHistories.filter(history => history.type === 'experience');

    res.status(200).json({
      success: true,
      message: 'Employee overview retrieved successfully',
      data: {
        user: {
          id: user.id,
          emp_id: user.emp_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          status: user.status,
          department_id: user.department_id,
          designation: user.designation,
          report_to: user.report_to,
          created_at: user.created_at,
          updated_at: user.updated_at,
          Department: user.Department,
          EmployeeDetail: user.EmployeeDetail,
          education,
          professional,
          Documents: user.Documents
        }
      }
    });
  } catch (error) {
    const errorResponse = handleControllerError(error, 'get employee overview');
    res.status(500).json(errorResponse);
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Admin)
exports.getAllEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      where: {
        role: 'employee'
      },
      include: [
        {
          model: EmployeeDetail,
          as: 'EmployeeDetail'
        },
        {
          model: Department,
          as: 'Department'
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: {
        employees: rows,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    const errorResponse = handleControllerError(error, 'get all employees');
    res.status(500).json(errorResponse);
  }
};