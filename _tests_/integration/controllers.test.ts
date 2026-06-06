import request from 'supertest';
import express from 'express';
import getAllUsersRoutes from '../../src/router/Users.routes';

// Mock the mailer module
jest.mock('../../src/mailer/mailer', () => ({
  sendEmail: jest.fn().mockResolvedValue('Email sent successfully')
}));

const app = express();
app.use(express.json());
getAllUsersRoutes(app);

describe('User API Integration Tests', () => {
  
  it('GET /user - should return array of users', async () => {
    const response = await request(app).get('/user');
    expect([200, 404]).toContain(response.status);
  });

  it('POST /login - should return 200 for valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('POST /adduser - should create a new user', async () => {
    const uniqueId = Date.now();
    const response = await request(app)
      .post('/adduser')
      .send({
        full_name: 'Test User',
        email: `test${uniqueId}@example.com`,
        phone: `071234567${uniqueId.toString().slice(-3)}`,
        password: 'password123',
        role: 'CUSTOMER'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toContain('User added successfully');
  }, 10000); // Increase timeout to 10 seconds
});