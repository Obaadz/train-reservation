import React from "react";
import { useTranslation } from "react-i18next";
import { Edit, Key } from "lucide-react";
import { Employee } from "../../../services/employee.service";
import Button from "../../common/Button";
import Table from "../../common/Table";

interface EmployeeListProps {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onResetPassword: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  loading,
  onEdit,
  onResetPassword,
}) => {
  const { t } = useTranslation(["dashboard"]);

  const columns = [
    { key: "name", header: t("name") },
    { key: "email", header: t("email") },
    { key: "role", header: t("role") },
    { key: "contractType", header: t("contractType") },
    { key: "branchLocation", header: t("branchLocation") },
    {
      key: "actions",
      header: t("actions"),
      render: (employee: Employee) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onEdit(employee);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          {employee && employee.canLogin ? (
            <Button variant="ghost" size="sm" onClick={() => onResetPassword(employee)}>
              <Key className="w-4 h-4" />
            </Button>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  return (
    <Table columns={columns} data={employees} loading={loading} emptyMessage={t("noEmployees")} />
  );
};

export default EmployeeList;
