import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import Button from "../../common/Button";
import { trainClasses } from "../../../data/trainClasses";
import SeatSelection from "../../booking/SeatSelection";

interface SeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  journeyId: string;
  onConfirm: (seat: string, classId: string) => void;
}

const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  isOpen,
  onClose,
  journeyId,
  onConfirm,
}) => {
  const { t } = useTranslation(["booking"]);
  const [selectedClass, setSelectedClass] = useState(trainClasses[0].id);
  const [selectedSeat, setSelectedSeat] = useState("");

  const handleConfirm = () => {
    if (!selectedSeat) {
      return;
    }
    onConfirm(selectedSeat, selectedClass);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("seatSelection")}>
      <div className="space-y-6">
        {/* Class Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("selectClass")}</label>
          <div className="grid grid-cols-3 gap-4">
            {trainClasses.map((trainClass) => (
              <button
                key={trainClass.id}
                onClick={() => setSelectedClass(trainClass.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  selectedClass === trainClass.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-200"
                }`}
              >
                <div className="font-medium">{trainClass.nameEn}</div>
                <div className="text-sm text-gray-500">{trainClass.descriptionEn}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Seat Selection */}
        <SeatSelection
          selectedSeat={selectedSeat}
          onSeatSelect={setSelectedSeat}
          availableSeats={["A1", "A2", "B1", "B2", "C1", "C2"]}
          coachClass={selectedClass as any}
          journeyId={journeyId}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            {t("common:cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedSeat}>
            {t("common:confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SeatSelectionModal;
