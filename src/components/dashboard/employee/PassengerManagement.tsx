import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Users, Search, Edit, Key } from "lucide-react";
import { useApi } from "../../../utils/api";
import { useToast } from "../../../contexts/ToastContext";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import FormField from "../../auth/FormField";

interface Passenger {
  pid: string;
  name: string;
  email: string;
  loyalty_status: string;
  loyalty_points: number;
  created_at: string;
}

const PassengerManagement: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);
  const api = useApi();
  const { showToast } = useToast();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    try {
      const data = await api.get("/passengers");
      setPassengers(data);
    } catch (error) {
      showToast(t("errors.fetchPassengers"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassenger = async (values: Partial<Passenger>) => {
    if (!selectedPassenger) return;

    try {
      await api.put(`/passengers/${selectedPassenger.pid}`, values);
      showToast(t("success.passengerUpdated"), "success");
      setIsEditModalOpen(false);
      fetchPassengers();
    } catch (error) {
      showToast(t("errors.updatePassenger"), "error");
    }
  };

  const handleResetPassword = async () => {
    if (!selectedPassenger || !newPassword) return;

    try {
      await api.post(`/passengers/${selectedPassenger.pid}/reset-password`, {
        password: newPassword,
      });
      showToast(t("success.passwordReset"), "success");
      setIsPasswordModalOpen(false);
      setNewPassword("");
    } catch (error) {
      showToast(t("errors.passwordReset"), "error");
    }
  };

  const filteredPassengers = passengers.filter(
    (passenger) =>
      passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t("passengerManagement")}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchPassengers")}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {t("name")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {t("email")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {t("loyaltyStatus")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {t("loyaltyPoints")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPassengers.map((passenger) => (
                <tr key={passenger.pid}>
                  <td className="px-6 py-4 whitespace-nowrap">{passenger.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{passenger.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        passenger.loyalty_status === "PLATINUM"
                          ? "bg-purple-100 text-purple-800"
                          : passenger.loyalty_status === "GOLD"
                          ? "bg-yellow-100 text-yellow-800"
                          : passenger.loyalty_status === "SILVER"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-bronze-100 text-bronze-800"
                      }`}
                    >
                      {passenger.loyalty_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{passenger.loyalty_points}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPassenger(passenger);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPassenger(passenger);
                          setIsPasswordModalOpen(true);
                        }}
                      >
                        <Key className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("editPassenger")}
      >
        {selectedPassenger && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdatePassenger({
                name: (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value,
                loyalty_points: parseInt(
                  (e.currentTarget.elements.namedItem("loyalty_points") as HTMLInputElement).value
                ),
              });
            }}
          >
            <div className="space-y-4">
              <FormField label={t("name")} name="name" defaultValue={selectedPassenger.name} />
              <FormField
                label={t("loyaltyPoints")}
                name="loyalty_points"
                type="number"
                defaultValue={selectedPassenger.loyalty_points.toString()}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("save")}</Button>
              </div>
            </div>
          </form>
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
            <Button onClick={handleResetPassword}>{t("resetPassword")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PassengerManagement;
