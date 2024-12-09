import bcrypt from 'bcryptjs';
import pool from './config/database';

const setupMockData = async () => {
  try {
    // Check if mock data already exists
    const [existingPassengers] = await pool.query('SELECT * FROM passengers LIMIT 1');
    if ((existingPassengers as any[]).length > 0) {
      console.log('Mock data already exists');
      return;
    }

    // Create test passengers
    const passengers = [
      {
        pid: 'P001',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        password: await bcrypt.hash('password123', 10),
        loyalty_status: 'GOLD',
        loyalty_points: 1000
      },
      {
        pid: 'P002',
        name: 'سارة عبدالله',
        email: 'sara@example.com',
        password: await bcrypt.hash('password123', 10),
        loyalty_status: 'SILVER',
        loyalty_points: 500
      }
    ];

    // Insert test passengers
    for (const passenger of passengers) {
      await pool.query(
        'INSERT INTO passengers (pid, name, email, password, loyalty_status, loyalty_points) VALUES (?, ?, ?, ?, ?, ?)',
        [passenger.pid, passenger.name, passenger.email, passenger.password, passenger.loyalty_status, passenger.loyalty_points]
      );
    }

    console.log('Mock data setup completed successfully');
  } catch (error) {
    console.error('Error setting up mock data:', error);
  }
};

export default setupMockData;