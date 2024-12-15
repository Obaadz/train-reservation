import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import BookingSteps from "../components/booking/BookingSteps";
import SeatSelection from "../components/booking/SeatSelection";
import PassengerDetails from "../components/booking/PassengerDetails";
import PaymentForm from "../components/booking/PaymentForm";
import Button from "../components/common/Button";

const STEPS = ["seatSelection", "passengerDetails", "payment", "confirmation"];

const Booking: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["booking"]);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [passengerDetails, setPassengerDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    idNumber: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    if (user?.userType == "employee") {
      navigate("/employee/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleNext = () => {
    if (currentStep === 0 && !selectedSeat) {
      showToast(t("errors.selectSeat"), "error");
      return;
    }

    if (currentStep === 1) {
      if (!passengerDetails.name || !passengerDetails.email || !passengerDetails.phone) {
        showToast(t("errors.fillDetails"), "error");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create booking
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          journeyId: id,
          seatNumber: selectedSeat,
          passengerDetails,
          paymentDetails: {
            method: "CREDIT_CARD",
            last4: paymentDetails.cardNumber.slice(-4),
          },
        }),
      });

      if (!response.ok) throw new Error();

      showToast(t("success.bookingConfirmed"), "success");
      setCurrentStep(3); // Move to confirmation step
    } catch (error) {
      showToast(t("errors.bookingFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <SeatSelection
            selectedSeat={selectedSeat}
            onSeatSelect={setSelectedSeat}
            availableSeats={["A1", "A2", "B1", "B2", "C1", "C2"]}
            coachClass="ECONOMY"
          />
        );
      case 1:
        return (
          <PassengerDetails
            formData={passengerDetails}
            onChange={(field, value) =>
              setPassengerDetails((prev) => ({ ...prev, [field]: value }))
            }
          />
        );
      case 2:
        return (
          <PaymentForm
            formData={paymentDetails}
            onChange={(field, value) => setPaymentDetails((prev) => ({ ...prev, [field]: value }))}
            onSubmit={handlePayment}
            totalAmount={250}
            loading={loading}
          />
        );
      case 3:
        return (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t("success.bookingConfirmed")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("success.bookingReference")}: BOK-{Date.now().toString().slice(-6)}
            </p>
            <Button onClick={() => navigate("/dashboard")}>{t("viewBookings")}</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t("title")}</h1>

      <BookingSteps currentStep={currentStep} steps={STEPS} />

      {renderStepContent()}

      {currentStep < 3 && (
        <div className="mt-8 flex justify-between">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              {t("back")}
            </Button>
          )}
          {currentStep < 2 && (
            <Button onClick={handleNext} className="ml-auto">
              {t("next")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Booking;
