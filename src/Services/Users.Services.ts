import { User } from './../Types/Users.type';
import * as UsersRepository from '../repositories/Users.repositories';
import dotenv from 'dotenv';
import { NewUser, updateUser } from '../Types/Users.type';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { emailTemplate } from '../mailer/emailTemplates';
import { sendEmail } from '../mailer/mailer';

dotenv.config();

export const getAllUsers = async () => await UsersRepository.getAllUsers();

export const createUser = async (User: NewUser) => {
    // Check if email already exists
    const existingEmail = await UsersRepository.getUserByEmail(User.email);
    if (existingEmail) {
        throw new Error('Email already registered');
    }

    // Check if phone already exists
    const existingPhone = await UsersRepository.getUserByPhone(User.phone);
    if (existingPhone) {
        throw new Error('Phone number already registered');
    }

    // Hash the user's password
    if (User.password) {
        User.password = await bcrypt.hash(User.password, 10);
    }

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Insert user into database
    await UsersRepository.createUser(User);

    // Store verification code
    await UsersRepository.setVerificationCode(User.email, verificationCode);

    // Send verification email in the background – no await
    // This prevents timeout issues on Render's free tier
    sendEmail(
        User.email,
        'Verify your email for SmartLaundry pickup and delivery system app',
        emailTemplate.verify(User.full_name, verificationCode),
    ).catch((error) => {
        console.error('Background email failed to send:', error.message);
    });

    return {
        message: 'User added successfully. Please check your email to verify your account.',
        email: User.email
    };
};

export const verifyUser = async (email: string, code: string) => {
    const User = await UsersRepository.getUserByEmail(email);
    if (!User) {
        throw new Error('User not found');
    }

    if (User.verification_code !== code) {
        throw new Error('Invalid verification code');
    }

    await UsersRepository.verifyUser(email);

    // Send verification success email in the background – no await
    sendEmail(
        User.email,
        'Your email has been verified - SmartLaundry pickup and delivery system app',
        emailTemplate.verifiedSuccess(User.full_name)
    ).catch((error) => {
        console.error('Background verification email failed:', error.message);
    });

    return { message: 'User verified successfully' };
};

export const getUserById = async (id: number) => await UsersRepository.getUserById(id);

export const deleteUserById = async (id: number) => await UsersRepository.deleteUserById(id);

export const updateUserById = async (id: number, User: updateUser) => {
    return await UsersRepository.updateUserById(id, User);
};

export const loginUsers = async (email: string, password: string) => {
    // Find user by email
    const user = await UsersRepository.getUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }

    if (!user.is_verified) {
        throw new Error('Please verify your email before logging in');
    }

    // Compare the passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Create a JWT payload
    const payload = {
        sub: user.user_id,
        full_name: user.full_name,
        role: user.role,
    };

    // Generate a JWT token
    const secret = process.env.JWT_SECRET as string;
    if (!secret) throw new Error('JWT Secret is not defined');

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    // Return successful login
    return {
        message: 'Login successful',
        token,
        user: {
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role
        }
    };
};