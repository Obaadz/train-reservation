# Train Reservation System

A full-stack bilingual (Arabic/English) train reservation system built with React, Node.js, Express, and MySQL.

## Features

- 🌐 Bilingual support (Arabic/English)
- 🚂 Real-time train search and booking
- 👤 User authentication and authorization
- 💳 Loyalty program with points system
- 📱 Responsive design
- 🔔 Real-time notifications
- 📊 Admin dashboard
- 🎫 Booking management
- 🔒 Secure payment processing

## Prerequisites

1. Node.js (v18 or higher)
2. MySQL Server
3. npm or yarn

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/train-reservation.git
   cd train-reservation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your configuration:
     ```env
     # Database Configuration
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=train_reservation

     # JWT Configuration
     JWT_SECRET=your_jwt_secret_key

     # Server Configuration
     PORT=3000
     NODE_ENV=development
     ```

4. Set up the database:
   - Follow the instructions in `DATABASE_SETUP.md`
   - Run the SQL scripts to create tables and insert sample data

5. Start the development servers:

   ```bash
   # Start backend server
   npm run server

   # In another terminal, start frontend
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── auth/      # Authentication components
│   ├── booking/   # Booking-related components
│   ├── common/    # Common UI components
│   ├── dashboard/ # Dashboard components
│   └── search/    # Search components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── i18n/          # Internationalization
│   └── locales/   # Translation files
├── pages/         # Page components
├── server/        # Backend code
│   ├── config/    # Configuration
│   ├── models/    # Database models
│   └── routes/    # API routes
├── styles/        # Global styles
└── utils/         # Utility functions
```

## API Documentation

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Journeys
- GET `/api/journeys/search` - Search available journeys
- GET `/api/journeys/:id` - Get journey details

### Bookings
- POST `/api/bookings` - Create new booking
- GET `/api/bookings/my-bookings` - Get user's bookings
- POST `/api/bookings/:id/cancel` - Cancel booking

### Notifications
- GET `/api/notifications` - Get user's notifications
- POST `/api/notifications/:id/read` - Mark notification as read
- POST `/api/notifications/send` - Send notifications (admin only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.