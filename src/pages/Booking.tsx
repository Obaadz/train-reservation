import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BookingSteps from "../components/booking/BookingSteps";
import SeatSelection from "../components/booking/SeatSelection";
import PassengerDetails from "../components/booking/PassengerDetails";
import PaymentForm from "../components/booking/PaymentForm";
import { useAuth } from "../contexts/AuthContext";

const STEPS = ["seatSelection", "passengerDetails", "payment", "confirmation"];

const Booking: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["booking"]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    email: "",
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
  }, [isAuthenticated, navigate]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
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
          paymentDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      const data = await response.json();
      setCurrentStep(STEPS.length - 1); // Move to confirmation step
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <SeatSelection
            selectedSeat={selectedSeat}
            onSeatSelect={setSelectedSeat}
            availableSeats={["A1", "A2", "B1", "B2", "C1", "C2"]} // This should come from API
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
            totalAmount={250} // This should come from journey details
          />
        );
      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-green-600 text-xl font-semibold mb-4">{t("bookingSuccess")}</div>
            <p className="text-gray-600">{t("bookingReference")}: BOK-123456</p>
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

      <div className="mt-8 flex justify-between">
        {currentStep > 0 && currentStep < STEPS.length - 1 && (
          <button
            onClick={handleBack}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {t("common:back")}
          </button>
        )}
        {currentStep < STEPS.length - 1 && (
          <button
            onClick={currentStep === 2 ? handleSubmit : handleNext}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ml-auto"
          >
            {currentStep === 2 ? t("common:confirm") : t("common:next")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Booking;
