import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import bookingRouter from './routes/bookings';
import journeyRouter from './routes/journeys';
import notificationRouter from './routes/notifications';
import employeeRouter from './routes/employees';
import passengerRouter from './routes/passengers';
import setupMockData from './mockData';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/journeys', journeyRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/passengers', passengerRouter);

const PORT = process.env.PORT || 3000;

// Setup mock data if in development environment
if (process.env.NODE_ENV === 'development') {
  setupMockData().catch(console.error);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;