import { Router } from 'express';
import { EmployeeModel } from '../models/Employee';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

// Get all employees (admin only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const employees = await EmployeeModel.findAll();
    res.json(employees);
  } catch (error) {
    console.error('Employees retrieval error:', error);
    res.status(500).json({ 
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب بيانات الموظفين'
        : 'Error fetching employees'
    });
  }
});

// Get employee by ID (admin only)
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: req.headers['accept-language']?.includes('ar')
          ? 'الموظف غير موجود'
          : 'Employee not found'
      });
    }
    res.json(employee);
  } catch (error) {
    console.error('Employee retrieval error:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب بيانات الموظف'
        : 'Error fetching employee'
    });
  }
});

// Create new employee (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
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
      canLogin,
      certificationDetails
    } = req.body;

    const eid = `EMP${Date.now()}`;
    const hireDate = new Date();

    const employee = await EmployeeModel.create({
      eid,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      email,
      salary,
      contract_type: contractType,
      shift_type: shiftType,
      branch_location: branchLocation,
      role,
      station_code: stationCode,
      hire_date: hireDate,
      can_login: canLogin,
      certification_details: certificationDetails
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Employee creation error:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في إنشاء الموظف'
        : 'Error creating employee'
    });
  }
});

// Update employee (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: req.headers['accept-language']?.includes('ar')
          ? 'الموظف غير موجود'
          : 'Employee not found'
      });
    }

    const updatedEmployee = await EmployeeModel.update(req.params.id, req.body);
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Employee update error:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في تحديث بيانات الموظف'
        : 'Error updating employee'
    });
  }
});

// Delete employee (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: req.headers['accept-language']?.includes('ar')
          ? 'الموظف غير موجود'
          : 'Employee not found'
      });
    }

    await EmployeeModel.delete(req.params.id);
    res.json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'تم حذف الموظف بنجاح'
        : 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Employee deletion error:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في حذف الموظف'
        : 'Error deleting employee'
    });
  }
});

export default router;