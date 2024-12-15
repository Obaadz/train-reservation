import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Clock, Edit, X, Search, Plus } from "lucide-react";
import Table from "../../common/Table";
import { useApi } from "../../../utils/api";
import { useToast } from "../../../contexts/ToastContext";
import Button from "../../common/Button";
import Modal from "../../common/Modal";
import FormField from "../../auth/FormField";
import Loading from "../../common/Loading";
import { trainClasses } from "../../../data/trainClasses";
import { useBookings } from "../../../hooks/useBookings";
import AddBookingModal from "./addBookingModal";

interface BookingFormData {
  passenger_name: string;
  email: string;
  phone: string;
  class_id: string;
  coach_number: string;
  seat_number: string;
  booking_status: string;
  payment_status: string;
  payment_method: string;
  amount: string;
}

const BookingsManagement: React.FC = () => {
  const { t } = useTranslation(["dashboard"]);
  const { bookings, loading, fetchBookings, updateBookingStatus, cancelBooking } = useBookings();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<BookingFormData>({
    passenger_name: "",
    email: "",
    phone: "",
    class_id: "",
    coach_number: "",
    seat_number: "",
    booking_status: "",
    payment_status: "",
    payment_method: "",
    amount: "",
  });
  const api = useApi();
  const { showToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (selectedBooking) {
      setFormData({
        passenger_name: selectedBooking.passenger_name || "",
        email: selectedBooking.email || "",
        phone: selectedBooking.phone || "",
        class_id: selectedBooking.class_id || "",
        coach_number: selectedBooking.coach_number || "",
        seat_number: selectedBooking.seat_number || "",
        booking_status: selectedBooking.booking_status || "",
        payment_status: selectedBooking.payment_status || "",
        payment_method: selectedBooking.payment_method || "",
        amount: selectedBooking.amount?.toString() || "",
      });
    }
  }, [selectedBooking]);

  useEffect(() => {
    fetchBookings();
  }, [isAddModalOpen]);

  const handleUpdateBooking = async () => {
    try {
      await api.put(`/bookings/${selectedBooking.booking_id}`, formData);
      showToast(t("success.bookingUpdated"), "success");
      setIsEditModalOpen(false);
      fetchBookings();
    } catch (error) {
      showToast(t("errors.updateBooking"), "error");
    }
  };

  const columns = [
    { key: "booking_id", header: t("bookingId") },
    { key: "passenger_name", header: t("passenger") },
    { key: "train_id", header: t("trainId") },
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
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            booking.booking_status === "CONFIRMED"
              ? "bg-green-100 text-green-800"
              : booking.booking_status === "WAITLISTED"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
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
              setIsEditModalOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];
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
            className="pl-10 pr-4 me-2 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <Button onClick={() => setIsAddModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            {t("addBooking")}
          </Button>
          <AddBookingModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
      </div>

      <Table
        columns={columns}
        data={bookings || []}
        loading={loading}
        emptyMessage={t("noBookings")}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t("editBooking")}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("class")}</label>
              <select
                value={formData.class_id}
                onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {trainClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label={t("coachNumber")}
              value={formData.coach_number}
              onChange={(e) => setFormData({ ...formData, coach_number: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label={t("seatNumber")}
              value={formData.seat_number}
              onChange={(e) => setFormData({ ...formData, seat_number: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("bookingStatus")}
              </label>
              <select
                value={formData.booking_status}
                onChange={(e) => setFormData({ ...formData, booking_status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="CONFIRMED">{t("statusCONFIRMED")}</option>
                <option value="WAITLISTED">{t("statusWAITLISTED")}</option>
                <option value="CANCELLED">{t("statusCANCELLED")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("paymentStatus")}
              </label>
              <select
                value={formData.payment_status}
                onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="PENDING">{t("paymentStatusPENDING")}</option>
                <option value="COMPLETED">{t("paymentStatusCOMPLETED")}</option>
                <option value="REFUNDED">{t("paymentStatusREFUNDED")}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("paymentMethod")}
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="CREDIT_CARD">{t("creditCard")}</option>
                <option value="DEBIT_CARD">{t("debitCard")}</option>
                <option value="CASH">{t("cash")}</option>
              </select>
            </div>
          </div>

          <FormField
            label={t("amount")}
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleUpdateBooking}>{t("save")}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingsManagement;
