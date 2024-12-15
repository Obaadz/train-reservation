import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Clock, Edit, X } from "lucide-react";
import Table from "../../common/Table";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import { useApi } from "../../../utils/api";
import { useToast } from "../../../contexts/ToastContext";

interface Booking {
  booking_id: string;
  passenger_name: string;
  journey_id: string;
  train_id: string;
  from: string;
  to: string;
  booking_date: string;
  booking_status: "CONFIRMED" | "WAITLISTED" | "CANCELLED";
  payment_status: "PENDING" | "COMPLETED" | "REFUNDED";
  amount: string;
}

const BookingsManagement: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);
  const api = useApi();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings/all");
      setBookings(response);
    } catch (error) {
      showToast(t("errors.fetchBookings"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      await api.put(`/bookings/${selectedBooking.booking_id}/status`, {
        status: newStatus,
      });
      showToast(t("success.bookingUpdated"), "success");
      setIsEditModalOpen(false);
      fetchBookings();
    } catch (error) {
      showToast(t("errors.updateBooking"), "error");
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      showToast(t("success.bookingCancelled"), "success");
      fetchBookings();
    } catch (error) {
      showToast(t("errors.cancelBooking"), "error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "WAITLISTED":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    { key: "booking_id", header: t("bookingId") },
    { key: "passenger_name", header: t("passenger") },
    {
      key: "route",
      header: t("route"),
      render: (booking: Booking) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>
            {booking.from} → {booking.to}
          </span>
        </div>
      ),
    },
    {
      key: "booking_date",
      header: t("date"),
      render: (booking: Booking) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: "booking_status",
      header: t("status"),
      render: (booking: Booking) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            booking.booking_status
          )}`}
        >
          {t(`status${booking.booking_status}`)}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("actions"),
      render: (booking: Booking) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedBooking(booking);
              setNewStatus(booking.booking_status);
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          {booking.booking_status !== "CANCELLED" && (
            <Button variant="ghost" size="sm" onClick={() => handleCancel(booking.booking_id)}>
              <X className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t("bookingManagement")}</h2>
      </div>

      <Table columns={columns} data={bookings} loading={loading} emptyMessage={t("noBookings")} />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("editBooking")}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("status")}</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="CONFIRMED">{t("statusCONFIRMED")}</option>
              <option value="WAITLISTED">{t("statusWAITLISTED")}</option>
              <option value="CANCELLED">{t("statusCANCELLED")}</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleStatusChange}>{t("save")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingsManagement;
