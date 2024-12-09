import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Users, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useToast } from '../../contexts/ToastContext';

interface Passenger {
  id: string;
  name: string;
  email: string;
  loyaltyStatus: string;
}

const NotificationsPanel: React.FC = () => {
  const { t } = useTranslation(['dashboard']);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPassengers = async () => {
    try {
      const response = await fetch('/api/passengers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPassengers(data);
    } catch (error) {
      console.error('Failed to fetch passengers:', error);
      showToast(t('errors.fetchPassengers'), 'error');
    }
  };

  const handleSendNotification = async () => {
    if (!message.trim() || selectedPassengers.length === 0) {
      showToast(t('errors.invalidNotification'), 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message,
          passengerIds: selectedPassengers,
          type: 'SYSTEM'
        })
      });

      if (!response.ok) throw new Error();

      showToast(t('notifications.sendSuccess'), 'success');
      setIsModalOpen(false);
      setMessage('');
      setSelectedPassengers([]);
    } catch (error) {
      showToast(t('errors.sendNotification'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedPassengers.length === passengers.length) {
      setSelectedPassengers([]);
    } else {
      setSelectedPassengers(passengers.map(p => p.id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">{t('notifications.title')}</h2>
        </div>
        <Button
          onClick={() => {
            fetchPassengers();
            setIsModalOpen(true);
          }}
          leftIcon={<Send className="w-4 h-4" />}
        >
          {t('notifications.send')}
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('notifications.sendNew')}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              loading={loading}
              onClick={handleSendNotification}
              leftIcon={<Send className="w-4 h-4" />}
            >
              {t('notifications.send')}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('notifications.message')}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder={t('notifications.messagePlaceholder')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('notifications.selectPassengers')}
              </label>
              <button
                onClick={handleSelectAll}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {selectedPassengers.length === passengers.length
                  ? t('notifications.deselectAll')
                  : t('notifications.selectAll')}
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
              {passengers.map(passenger => (
                <label
                  key={passenger.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPassengers.includes(passenger.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPassengers(prev => [...prev, passenger.id]);
                      } else {
                        setSelectedPassengers(prev => 
                          prev.filter(id => id !== passenger.id)
                        );
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                  <div className="ml-3">
                    <div className="font-medium">{passenger.name}</div>
                    <div className="text-sm text-gray-500">{passenger.email}</div>
                  </div>
                  <div className="ml-auto text-sm text-gray-500">
                    {passenger.loyaltyStatus}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationsPanel;