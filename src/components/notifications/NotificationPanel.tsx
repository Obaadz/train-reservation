import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, Clock, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../common/Button';

interface Notification {
  notification_id: string;
  message: string;
  type: 'BOOKING_CONFIRMATION' | 'JOURNEY_REMINDER' | 'SYSTEM';
  created_at: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

const NotificationPanel: React.FC = () => {
  const { t } = useTranslation(['common']);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => n.status !== 'READ').length;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error();
        
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        showToast(t('errors.fetchNotifications'), 'error');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, isAuthenticated, showToast, t]);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error();

      setNotifications(prev =>
        prev.map(notification =>
          notification.notification_id === id
            ? { ...notification, status: 'READ' as const }
            : notification
        )
      );
    } catch (error) {
      showToast(t('errors.updateNotification'), 'error');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'BOOKING_CONFIRMATION':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'JOURNEY_REMINDER':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 scale-in">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t('notifications.title')}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                {t('notifications.loading')}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {t('notifications.empty')}
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.notification_id}
                  className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                    notification.status !== 'READ' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    {notification.status !== 'READ' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.notification_id)}
                      >
                        {t('notifications.markAsRead')}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;