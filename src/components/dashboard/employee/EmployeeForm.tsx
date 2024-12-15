import React from "react";
import { useTranslation } from "react-i18next";
import FormField from "../../auth/FormField";
import Button from "../../common/Button";
import { CreateEmployeeData } from "../../../services/employee.service";

interface EmployeeFormProps {
  initialData?: Partial<CreateEmployeeData>;
  onSubmit: (data: CreateEmployeeData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading,
}) => {
  const { t } = useTranslation(["dashboard"]);
  const [formData, setFormData] = React.useState<Partial<CreateEmployeeData>>(
    initialData || {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      salary: 0,
      contractType: "FULL_TIME",
      shiftType: "MORNING",
      branchLocation: "",
      role: "STAFF",
      stationCode: "",
      canLogin: false,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.password) setFormData((prev) => ({ ...prev, password: undefined }));

    await onSubmit(formData as CreateEmployeeData);
  };

  const handleChange = (field: keyof CreateEmployeeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t("firstName")}
          required
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />

        <FormField
          label={t("middleName")}
          value={formData.middleName}
          onChange={(e) => handleChange("middleName", e.target.value)}
        />

        <FormField
          label={t("lastName")}
          required
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />

        <FormField
          label={t("salary")}
          type="number"
          required
          value={formData.salary}
          onChange={(e) => handleChange("salary", parseFloat(e.target.value))}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("contractType")}
          </label>
          <select
            value={formData.contractType}
            onChange={(e) => handleChange("contractType", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="FULL_TIME">{t("fullTime")}</option>
            <option value="PART_TIME">{t("partTime")}</option>
            <option value="TEMPORARY">{t("temporary")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("shiftType")}</label>
          <select
            value={formData.shiftType}
            onChange={(e) => handleChange("shiftType", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="MORNING">{t("morning")}</option>
            <option value="EVENING">{t("evening")}</option>
            <option value="NIGHT">{t("night")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("role")}</label>
          <select
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="STAFF">{t("staff")}</option>
            <option value="RECEPTIONIST">{t("receptionist")}</option>
            <option value="DRIVER">{t("driver")}</option>
            <option value="TECHNICIAN">{t("technician")}</option>
            <option value="CLEANER">{t("cleaner")}</option>
            <option value="MANAGER">{t("manager")}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("stationCode")}</label>
          <select
            value={formData.stationCode}
            onChange={(e) => {
              handleChange("stationCode", e.target.value);
              handleChange("branchLocation", t(e.target.value));
            }}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="ST001">{t("ST001")}</option>
            <option value="ST002">{t("ST002")}</option>
            <option value="ST003">{t("ST003")}</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="canLogin"
            checked={formData.canLogin}
            onChange={(e) => handleChange("canLogin", e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="canLogin" className="text-sm font-medium text-gray-700">
            {t("allowDashboardAccess")}
          </label>
        </div>

        {formData.canLogin ? (
          <>
            <FormField
              label={t("email")}
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            {
              <FormField
                label={t("password")}
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder={t("passwordEmptyForNoChangePlaceholder")}
              />
            }
          </>
        ) : (
          ""
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button type="submit" loading={loading}>
          {initialData ? t("save") : t("create")}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
