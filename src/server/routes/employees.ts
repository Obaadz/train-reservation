import { Router } from 'express';
import { EmployeeModel } from '../models/Employee';
import { authenticateToken, isAdmin } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();


// Get employee profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    if (!req.user || req.user.userType !== 'employee') {
      return res.status(401).json({
        message: req.headers['accept-language']?.includes('ar')
          ? 'غير مصرح'
          : 'Unauthorized'
      });
    }

    const employee = await EmployeeModel.findById(req.user.id);
    if (!employee) {
      return res.status(404).json({
        message: req.headers['accept-language']?.includes('ar')
          ? 'الموظف غير موجود'
          : 'Employee not found'
      });
    }

    // Format the response
    const profile = {
      id: employee.eid,
      name: `${employee.first_name} ${employee.middle_name || ''} ${employee.last_name}`.trim(),
      email: employee.email,
      role: employee.role,
      contractType: employee.contract_type,
      shiftType: employee.shift_type,
      branchLocation: employee.branch_location,
      stationCode: employee.station_code,
      hireDate: employee.hire_date,
      salary: employee.salary
    };

    res.json(profile);
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب بيانات الموظف'
        : 'Error fetching employee profile'
    });
  }
});

// Get all employees (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const employees = await EmployeeModel.findAll();

    // Format employee data for frontend
    const formattedEmployees = employees.map(emp => ({
      eid: emp.eid,
      name: `${emp.first_name} ${emp.middle_name || ''} ${emp.last_name}`.trim(),
      email: emp.email,
      role: emp.role,
      salary: emp.salary,
      contractType: emp.contract_type,
      shiftType: emp.shift_type,
      branchLocation: emp.branch_location,
      stationCode: emp.station_code,
      hireDate: emp.hire_date,
      canLogin: emp.can_login
    }));

    res.json(formattedEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب بيانات الموظفين'
        : 'Error fetching employees'
    });
  }
});

// Create new employee
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      salary,
      contractType,
      shiftType,
      branchLocation,
      role,
      stationCode,
      canLogin
    } = req.body;

    const isArabic = req.headers['accept-language']?.includes('ar');

    // Validate required fields
    if (!firstName || !lastName || !salary || !contractType || !shiftType || !branchLocation || !role) {
      return res.status(400).json({
        message: isArabic
          ? 'جميع الحقول المطلوبة يجب تعبئتها'
          : 'All required fields must be filled'
      });
    }

    // If canLogin is true, validate email and password
    if (canLogin && (!email || !password)) {
      return res.status(400).json({
        message: isArabic
          ? 'البريد الإلكتروني وكلمة المرور مطلوبة للحسابات التي يمكنها تسجيل الدخول'
          : 'Email and password are required for accounts with login access'
      });
    }

    // Check if email already exists
    if (email) {
      const existingEmployee = await EmployeeModel.findByEmail(email);
      if (existingEmployee) {
        return res.status(400).json({
          message: isArabic
            ? 'البريد الإلكتروني مستخدم بالفعل'
            : 'Email already exists'
        });
      }
    }

    // Generate employee ID
    const eid = `EMP${Date.now()}`;

    // Create employee
    const newEmployee = await EmployeeModel.create({
      eid,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      email: email || null,
      password: password ? await bcrypt.hash(password, 10) : undefined,
      salary: Number(salary),
      contract_type: contractType,
      shift_type: shiftType,
      branch_location: branchLocation,
      role,
      station_code: stationCode,
      hire_date: new Date(),
      can_login: Boolean(canLogin)
    });

    res.status(201).json({
      message: isArabic
        ? 'تم إنشاء الموظف بنجاح'
        : 'Employee created successfully',
      employee: newEmployee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في إنشاء الموظف'
        : 'Error creating employee'
    });
  }
});

// Update employee
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      middleName,
      lastName,
      email,
      salary,
      contractType,
      shiftType,
      branchLocation,
      role,
      stationCode,
      canLogin
    } = req.body;

    const isArabic = req.headers['accept-language']?.includes('ar');

    // Check if employee exists
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({
        message: isArabic
          ? 'الموظف غير موجود'
          : 'Employee not found'
      });
    }

    // Update employee
    await EmployeeModel.update(id, {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      email,
      salary: Number(salary),
      contract_type: contractType,
      shift_type: shiftType,
      branch_location: branchLocation,
      role,
      station_code: stationCode,
      can_login: Boolean(canLogin)
    });

    res.json({
      message: isArabic
        ? 'تم تحديث بيانات الموظف بنجاح'
        : 'Employee updated successfully'
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في تحديث بيانات الموظف'
        : 'Error updating employee'
    });
  }
});

// Reset employee password
router.post('/:id/reset-password', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const isArabic = req.headers['accept-language']?.includes('ar');

    if (!password) {
      return res.status(400).json({
        message: isArabic
          ? 'كلمة المرور الجديدة مطلوبة'
          : 'New password is required'
      });
    }

    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({
        message: isArabic
          ? 'الموظف غير موجود'
          : 'Employee not found'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await EmployeeModel.update(id, { password: hashedPassword });

    res.json({
      message: isArabic
        ? 'تم تحديث كلمة المرور بنجاح'
        : 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في تحديث كلمة المرور'
        : 'Error resetting password'
    });
  }
});

export default router;