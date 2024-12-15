import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
import { useEmployees } from "../../../hooks/useEmployees";
import { Employee } from "../../../services/employee.service";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import EmployeeList from "./EmployeeList";
import EmployeeForm from "./EmployeeForm";
import FormField from "../../auth/FormField";

const EmployeeManagement: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);
  const { employees, loading, fetchEmployees, createEmployee, updateEmployee, resetPassword } =
    useEmployees();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleCreateEmployee = async (data: any) => {
    setFormLoading(true);
    try {
      await createEmployee(data);
      setIsCreateModalOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateEmployee = async (data: any) => {
    if (!selectedEmployee) return;
    setFormLoading(true);
    try {
      await updateEmployee(selectedEmployee.eid, data);
      setIsEditModalOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedEmployee || !newPassword) return;
    setFormLoading(true);
    try {
      await resetPassword(selectedEmployee.eid, newPassword);
      setIsPasswordModalOpen(false);
      setNewPassword("");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t("employeeManagement")}</h2>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          {t("addEmployee")}
        </Button>
      </div>

      <EmployeeList
        employees={employees}
        loading={loading}
        onEdit={(employee) => {
          setSelectedEmployee(employee);
          setIsEditModalOpen(true);
        }}
        onResetPassword={(employee) => {
          setSelectedEmployee(employee);
          setIsPasswordModalOpen(true);
        }}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t("addEmployee")}
      >
        <EmployeeForm
          onSubmit={handleCreateEmployee}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={formLoading}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("editEmployee")}
      >
        {selectedEmployee && (
          <EmployeeForm
            initialData={{
              firstName: selectedEmployee.name.split(" ")[0],
              lastName: selectedEmployee.name.split(" ").slice(-1)[0],
              middleName: selectedEmployee.name.split(" ").slice(1, -1).join(" "),
              email: selectedEmployee.email,
              salary: selectedEmployee.salary,
              contractType: selectedEmployee.contractType,
              shiftType: selectedEmployee.shiftType,
              branchLocation: selectedEmployee.branchLocation,
              role: selectedEmployee.role,
              stationCode: selectedEmployee.stationCode,
              canLogin: selectedEmployee.canLogin,
            }}
            onSubmit={handleUpdateEmployee}
            onCancel={() => setIsEditModalOpen(false)}
            loading={formLoading}
          />
        )}
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title={t("resetPassword")}
      >
        <div className="space-y-4">
          <FormField
            label={t("newPassword")}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleResetPassword} loading={formLoading}>
              {t("resetPassword")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
