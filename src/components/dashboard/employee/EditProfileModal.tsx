import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import EmployeeForm from "./EmployeeForm";
import { useApi } from "../../../utils/api";
import { useToast } from "../../../contexts/ToastContext";
import { CreateEmployeeData } from "../../../services/employee.service";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdate: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
}) => {
  const { t } = useTranslation(["dashboard"]);
  const api = useApi();
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: CreateEmployeeData) => {
    setLoading(true);
    try {
      await api.put(`/employees/${profile.id}`, data);
      showToast(t("success.profileUpdated"), "success");
      onProfileUpdate();
      onClose();
    } catch (error) {
      showToast(t("errors.updateProfile"), "error");
    } finally {
      setLoading(false);
    }
  };

  const initialData = {
    firstName: profile.name.split(" ")[0],
    lastName: profile.name.split(" ").slice(-1)[0],
    middleName: profile.name.split(" ").slice(1, -1).join(" "),
    email: profile.email,
    salary: profile.salary,
    contractType: profile.contractType,
    shiftType: profile.shiftType,
    branchLocation: profile.branchLocation,
    role: profile.role,
    stationCode: profile.stationCode,
    canLogin: true,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("editProfile")}>
      <EmployeeForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};

export default EditProfileModal;
