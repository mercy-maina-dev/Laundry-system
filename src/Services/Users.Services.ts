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
    // Normalize email and phone to avoid duplicates with different casing
    const email = User.email.toLowerCase().trim();
    const phone = User.phone.trim();

    // Hash password
    if (User.password) {
        User.password = await bcrypt.hash(User.password, 10);
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // Insert user – database unique constraints will catch duplicates
        await UsersRepository.createUser({
            ...User,
            email: email,
            phone: phone,
            verification_code: verificationCode
        });
    } catch (error: any) {
        // Check if error is a duplicate key (SQL Server error 2627)
        if (error.code === 'EREQUEST' && error.number === 2627) {
            // Determine which field caused the duplicate
            const message = error.message;
            if (message.includes('UQ__Users__AB6E61643222258C')) { // Email constraint
                throw new Error('Email already registered');
            } else if (message.includes('UQ__Users__B43B145F4292460B')) { // Phone constraint
                throw new Error('Phone number already registered');
            }
        }
        // Re-throw other errors
        throw error;
    }

    // Store verification code (if not already stored)
    await UsersRepository.setVerificationCode(email, verificationCode);

    // Send email (gracefully handle failure)
    try {
        await sendEmail(
            email,
            'Verify your email for SmartLaundry pickup and delivery system app',
            emailTemplate.verify(User.full_name, verificationCode),
        );
        console.log('Verification email sent to:', email);
    } catch (emailError: any) {
        console.error('Failed to send verification email:', emailError.message);
    }

    return {
        message: 'User added successfully. Please check your email to verify your account.',
        email: email
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

    try {
        await sendEmail(
            User.email,
            'Your email has been verified - SmartLaundry pickup and delivery system app',
            emailTemplate.verifiedSuccess(User.full_name)
        );
        console.log('Verification success email sent to:', User.email);
    } catch (emailError: any) {
        console.error('Failed to send verification success email:', emailError.message);
    }

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