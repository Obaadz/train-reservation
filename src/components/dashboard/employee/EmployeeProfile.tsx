import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Mail, Building, Calendar, Clock, CreditCard } from "lucide-react";
import Button from "../../common/Button";
import { useApi } from "../../../utils/api";
import { useToast } from "../../../contexts/ToastContext";
import Loading from "../../common/Loading";
import EditProfileModal from "./EditProfileModal";

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  contractType: string;
  shiftType: string;
  branchLocation: string;
  stationCode: string;
  hireDate: string;
  salary: number;
}

const EmployeeProfile: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);
  const api = useApi();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await api.get("/employees/profile");
      setProfile(data);
    } catch (error) {
      showToast(t("errors.fetchProfile"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [api, showToast, t]);

  if (loading) {
    return <Loading />;
  }

  if (!profile) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <p className="text-gray-500">
              {t(profile.role.toLowerCase())} - {profile.branchLocation}
            </p>
          </div>
          <Button className="ml-auto" onClick={() => setIsEditModalOpen(true)}>
            {t("editProfile")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("personalInfo")}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t("email")}</div>
                  <div>{profile.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t("branchLocation")}</div>
                  <div>{profile.branchLocation}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t("salary")}</div>
                  <div>{profile.salary} SAR</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("employmentInfo")}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t("joinDate")}</div>
                  <div>{formatDate(profile.hireDate)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t("contractType")}</div>
                  <div>{t(profile.contractType.toLowerCase())}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">{t("shiftType")}</div>
                  <div>{t(profile.shiftType.toLowerCase())}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {profile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          onProfileUpdate={fetchProfile}
        />
      )}
    </div>
  );
};

export default EmployeeProfile;
