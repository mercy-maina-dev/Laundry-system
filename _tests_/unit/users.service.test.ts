
/// <reference types="jest" />
import { loginUsers, verifyUser } from '../../src/Services/Users.Services';
import * as UsersRepository from '../../src/repositories/Users.repositories';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../src/repositories/Users.repositories');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/mailer/mailer');

describe('Users Service - Unit Tests', () => {
  
  describe('loginUsers', () => {
    it('should return token when credentials are valid', async () => {
      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        full_name: 'Test User',
        phone: '0712345678',
        role: 'CUSTOMER',
        is_verified: true
      };

      (UsersRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fake_jwt_token');

      const result = await loginUsers('test@example.com', 'password123');

      expect(result).toHaveProperty('token');
      expect(result.message).toBe('Login successful');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error when user not found', async () => {
      (UsersRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(loginUsers('wrong@email.com', 'password'))
        .rejects.toThrow('User not found');
    });

    it('should throw error when password is invalid', async () => {
      const mockUser = {
        user_id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        is_verified: true
      };

      (UsersRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginUsers('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('verifyUser', () => {
    it('should verify user when code is correct', async () => {
      const mockUser = {
        email: 'test@example.com',
        verification_code: '123456',
        full_name: 'Test User'
      };

      (UsersRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (UsersRepository.verifyUser as jest.Mock).mockResolvedValue(true);

      const result = await verifyUser('test@example.com', '123456');

      expect(result.message).toBe('User verified successfully');
    }, 10000); // Increased timeout for this test   

    it('should throw error when user not found', async () => {
      (UsersRepository.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(verifyUser('wrong@email.com', '123456'))
        .rejects.toThrow('User not found');
    });

    it('should throw error when code is invalid', async () => {
      const mockUser = {
        email: 'test@example.com',
        verification_code: '123456'
      };

      (UsersRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(verifyUser('test@example.com', '999999'))
        .rejects.toThrow('Invalid verification code');
    });
  });
});