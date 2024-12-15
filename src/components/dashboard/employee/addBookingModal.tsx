import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Calendar, Users, MapPin } from "lucide-react";
import Modal from "../../common/Modal";
import Button from "../../common/Button";
import FormField from "../../auth/FormField";
import DatePicker from "../../search/DatePicker";
import CitySelector from "../../search/CitySelector";
import { City, saudiCities } from "../../../data/saudiCities";
import { generateMockJourneys, Journey } from "../../../data/mockJourneys";
import JourneyCard from "../../search/JourneyCard";
import SeatSelectionModal from "./SeatSelectionModal";
import PassengerDetailsForm from "./PassengerDetailsForm";
import { useToast } from "../../../contexts/ToastContext";
import { useApi } from "../../../utils/api";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBookingModal: React.FC<AddBookingModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation(["search", "booking"]);
  const { showToast } = useToast();
  const api = useApi();

  const [fromCity, setFromCity] = useState<City | undefined>(undefined);
  const [toCity, setToCity] = useState<City | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [searchResults, setSearchResults] = useState<Journey[] | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
  });

  const handleSearch = () => {
    if (!fromCity || !toCity || !selectedDate) {
      showToast(t("common:allFieldsRequired"), "error");
      return;
    }

    const results = generateMockJourneys(fromCity, toCity, selectedDate.toISOString());
    setSearchResults(results);
  };

  const handleJourneySelect = (journey: any) => {
    setSelectedJourney(journey);
    setIsSeatModalOpen(true);
  };

  const handleSeatConfirm = (seat: string, classId: string) => {
    setSelectedSeat(seat);
    setSelectedClass(classId);
    setIsSeatModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedJourney || !selectedSeat || !selectedClass) {
        showToast(t("booking:errors.selectJourneyAndSeat"), "error");
        return;
      }

      if (!passengerDetails.name || !passengerDetails.email || !passengerDetails.phone) {
        showToast(t("booking:errors.fillDetails"), "error");
        return;
      }

      await api.post("/bookings", {
        journeyId: selectedJourney.id,
        classId: selectedClass,
        seatNumber: selectedSeat,
        passengerDetails,
        paymentDetails: {
          method: "CASH",
          status: "COMPLETED",
        },
      });

      showToast(t("booking:success.bookingConfirmed"), "success");
      onClose();
    } catch (error) {
      showToast(t("booking:errors.bookingFailed"), "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("booking:createBooking")}>
      <div className="space-y-6">
        {/* Search Form */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <CitySelector
              cities={saudiCities}
              selectedCity={fromCity}
              onSelect={setFromCity}
              label={t("from")}
              placeholder={t("selectCity")}
              isOpen={isFromOpen}
              onToggle={() => {
                setIsFromOpen(!isFromOpen);
                setIsToOpen(false);
              }}
            />
          </div>

          <div className="relative">
            <CitySelector
              cities={saudiCities}
              selectedCity={toCity}
              onSelect={setToCity}
              label={t("to")}
              placeholder={t("selectCity")}
              isOpen={isToOpen}
              onToggle={() => {
                setIsToOpen(!isToOpen);
                setIsFromOpen(false);
              }}
            />
          </div>

          <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} label={t("date")} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("passengers")}
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="1"
                max="10"
                className="w-full p-3 pl-12 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleSearch} fullWidth>
          {t("searchButton")}
        </Button>

        {/* Search Results */}
        {searchResults && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">{t("searchResults")}</h3>
            {searchResults.map((journey) => (
              <div
                key={journey.id}
                onClick={() => handleJourneySelect(journey)}
                className="cursor-pointer"
              >
                <JourneyCard journey={journey} />
              </div>
            ))}
          </div>
        )}

        {/* Passenger Details */}
        {selectedJourney && selectedSeat && (
          <PassengerDetailsForm
            formData={passengerDetails}
            onChange={(field, value) =>
              setPassengerDetails((prev) => ({ ...prev, [field]: value }))
            }
          />
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {t("common:cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedJourney || !selectedSeat}>
            {t("common:confirm")}
          </Button>
        </div>
      </div>

      {/* Seat Selection Modal */}
      <SeatSelectionModal
        isOpen={isSeatModalOpen}
        onClose={() => setIsSeatModalOpen(false)}
        journeyId={selectedJourney?.id || ""}
        onConfirm={handleSeatConfirm}
      />
    </Modal>
  );
};

export default AddBookingModal;
