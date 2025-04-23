// tests/integration/health.test.ts
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import connectDB from '../../config/db';
// Assuming you set up a test database URI (e.g., via process.env.MONGODB_URI_TEST)
// and your config/db.ts uses it when NODE_ENV='test'

beforeAll(async () => {
  // Ensure NODE_ENV is set to 'test' for jest scripts in package.json
  // Connect to the test database
  await connectDB(); // Or however you connect, potentially passing the test URI
});

afterAll(async () => {
  // Disconnect from the test database
  await mongoose.disconnect();
});

describe('GET /health', () => {
  it('should return 200 OK and a success message', async () => {
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Server is healthy');
    // Add more specific checks based on your actual endpoint response
  });
});

// Add more describe blocks for other routes (e.g., URL shortening)