import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Clock, Edit, X, Search } from "lucide-react";
import Table from "../../common/Table";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import { useBookings } from "../../../hooks/useBookings";
import FormField from "../../auth/FormField";
import Loading from "../../common/Loading";

const BookingsManagement: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);
  const { bookings, loading, fetchBookings, updateBookingStatus, cancelBooking } = useBookings();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      await updateBookingStatus(selectedBooking.booking_id, newStatus);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
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

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.passenger_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "booking_id", header: t("bookingId") },
    { key: "passenger_name", header: t("passenger") },
    {
      key: "route",
      header: t("route"),
      render: (booking: any) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>N/A</span>
        </div>
      ),
    },
    {
      key: "booking_date",
      header: t("date"),
      render: (booking: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      key: "booking_status",
      header: t("status"),
      render: (booking: any) => (
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
      render: (booking: any) => (
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
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t("bookingManagement")}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("searchBookings")}
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredBookings}
        loading={loading}
        emptyMessage={t("noBookings")}
      />

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
