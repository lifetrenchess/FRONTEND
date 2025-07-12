import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Check, 
  Trash2, 
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Clock
} from 'lucide-react';

interface UserData {
  fullName: string;
  email: string;
  isAuthenticated: boolean;
}

interface NotificationsProps {
  user: UserData | null;
}

const Notifications = ({ user }: NotificationsProps) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your trip to Bali has been confirmed for Dec 15-22, 2024',
      time: '2 hours ago',
      read: false,
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'price',
      title: 'Price Drop Alert',
      message: 'Flight to Paris dropped by $200! Book now to save.',
      time: '4 hours ago',
      read: false,
      icon: DollarSign,
      color: 'text-palette-orange'
    },
    {
      id: 3,
      type: 'destination',
      title: 'New Destination',
      message: 'Explore the beautiful beaches of Maldives with exclusive deals',
      time: '1 day ago',
      read: true,
      icon: MapPin,
      color: 'text-palette-teal'
    },
    {
      id: 4,
      type: 'review',
      title: 'Review Request',
      message: 'How was your recent trip to Tokyo? Share your experience!',
      time: '2 days ago',
      read: true,
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Upcoming Trip',
      message: 'Don\'t forget! Your Bali trip starts in 5 days',
      time: '3 days ago',
      read: true,
      icon: Clock,
      color: 'text-blue-600'
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your travel information</p>
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="text-palette-teal border-palette-teal hover:bg-palette-teal hover:text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button className="bg-palette-teal hover:bg-palette-teal/90 text-white">
            <Bell className="w-4 h-4 mr-2" />
            Notification Settings
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-palette-teal" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-lg font-semibold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-lg font-semibold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-lg font-semibold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-palette-orange" />
              <div>
                <p className="text-sm text-gray-600">Deals</p>
                <p className="text-lg font-semibold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-palette-orange text-white">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div 
                    key={notification.id} 
                    className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${
                      notification.read 
                        ? 'bg-gray-50 border-gray-100' 
                        : 'bg-white border-palette-teal/20 shadow-sm'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-200' : 'bg-palette-teal/10'}`}>
                      <Icon className={`w-5 h-5 ${notification.color}`} />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-palette-orange rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{notification.time}</span>
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-palette-teal hover:text-palette-teal/80"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications; 