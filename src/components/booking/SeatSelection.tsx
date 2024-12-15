import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReservation } from "../../hooks/useReservation";

interface SeatSelectionProps {
  selectedSeat: string;
  onSeatSelect: (seat: string) => void;
  availableSeats: string[];
  coachClass: "FIRST" | "BUSINESS" | "ECONOMY";
  journeyId: string;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
  selectedSeat,
  onSeatSelect,
  availableSeats,
  coachClass,
  journeyId,
}) => {
  const { t } = useTranslation(["booking"]);
  const reservation = useReservation();

  const [validSeats, setValidSeats] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const validateSeats = async () => {
      const results: Record<string, boolean> = {};
      for (const seat of availableSeats) {
        results[seat] = await reservation.validateSeat(journeyId, seat);
      }
      setValidSeats(results);
    };

    validateSeats();
  }, [availableSeats, journeyId, reservation]);

  const getCoachLayout = () => {
    switch (coachClass) {
      case "FIRST":
        return { rows: 4, seatsPerRow: 3 }; // 2-1 configuration
      case "BUSINESS":
        return { rows: 6, seatsPerRow: 4 }; // 2-2 configuration
      case "ECONOMY":
        return { rows: 8, seatsPerRow: 5 }; // 3-2 configuration
      default:
        return { rows: 8, seatsPerRow: 5 };
    }
  };

  const { rows, seatsPerRow } = getCoachLayout();

  const renderSeat = (seatNumber: string) => {
    const isAvailable = availableSeats.includes(seatNumber);
    const isSelected = selectedSeat === seatNumber;
    const isValidSeat = validSeats[seatNumber] ?? true; // Assume true until validation completes

    return (
      <button
        key={seatNumber}
        onClick={() => isAvailable && onSeatSelect(seatNumber)}
        disabled={!isAvailable || !isValidSeat}
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
          isSelected
            ? "bg-indigo-600 text-white"
            : isAvailable && isValidSeat
            ? "bg-white border-2 border-indigo-200 hover:border-indigo-600 text-gray-900"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {seatNumber}
      </button>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{t("seatSelection")}</h3>
      <div className="flex justify-center mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-indigo-200 rounded" />
            <span className="text-sm">{t("available")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-600 rounded" />
            <span className="text-sm">{t("selected")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded" />
            <span className="text-sm">{t("occupied")}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 justify-center">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {Array.from({ length: seatsPerRow }).map((_, seatIndex) => {
              const seatNumber = `${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`;
              return renderSeat(seatNumber);
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatSelection;
