import React from "react";
import { useTranslation } from "react-i18next";
import FormField from "../../auth/FormField";
import { User, Mail, Phone, CreditCard } from "lucide-react";

interface PassengerDetailsFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    idNumber: string;
  };
  onChange: (field: string, value: string) => void;
}

const PassengerDetailsForm: React.FC<PassengerDetailsFormProps> = ({ formData, onChange }) => {
  const { t } = useTranslation(["booking"]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("passengerDetails")}</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={t("name")}
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          icon={<User className="w-5 h-5 text-gray-400" />}
          placeholder={t("namePlaceholder")}
        />

        <FormField
          label={t("email")}
          type="email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          placeholder={t("emailPlaceholder")}
        />

        <FormField
          label={t("phone")}
          type="tel"
          value={formData.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          icon={<Phone className="w-5 h-5 text-gray-400" />}
          placeholder={t("phonePlaceholder")}
        />

        <FormField
          label={t("idNumber")}
          value={formData.idNumber}
          onChange={(e) => onChange("idNumber", e.target.value)}
          icon={<CreditCard className="w-5 h-5 text-gray-400" />}
          placeholder={t("idNumberPlaceholder")}
        />
      </div>
    </div>
  );
};

export default PassengerDetailsForm;
