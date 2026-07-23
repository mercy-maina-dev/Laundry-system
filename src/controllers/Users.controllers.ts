//import { loginUsers } from './../Services/Users.Services';
//import { loginUser } from './Users.controllers';
import { User } from './../Types/Users.type';

    import { Request,Response } from "express";
    import getpool from "../db/config";//establish a connection pool to the database
    import * as UsersServices from '../Services/Users.Services';// Import all functions from the UsersService module to handle business logic related to users
import { sendEmail } from '../mailer/mailer';
import * as UsersRepository from '../repositories/Users.repositories';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const Users = await UsersServices.getAllUsers();
    res.status(200).json(Users); // Remove the { Users } wrapper
  } catch (error: any) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
        

export const createUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const result = await UsersServices.createUser(userData);
        res.status(201).json(result);
    } catch (error: any) {
        console.error('Error creating user:', error.message);
        
        // Handle specific errors
        if (error.message === 'Email already registered') {
            return res.status(400).json({ error: 'Email already registered' });
        }
        if (error.message === 'Phone number already registered') {
            return res.status(400).json({ error: 'Phone number already registered' });
        }
        
        // For other errors, return 500
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

export const getUserById=async(req:Request,res:Response)=>{
    const id= parseInt(req.params.id as string);// Extract the user ID from the request parameters and convert it to an integer
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });// Send a bad request response if the user ID is not a valid number
    }
    try {
        const User=await UsersServices.getUserById(id);// Call the getUserById method from the UsersService to retrieve a user by their ID from the database
        if (!User) {
            return res.status(404).json({ error: 'User not found' });// Send a not found response if the user is not found
        }
        res.status(200).json({ User });// Send a success response to the client with the retrieved user data
    } catch (error: any) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal server error' });// Send an error response to the client
    }
}

export const deleteUserById=async(req:Request,res:Response)=>{
    const id= parseInt(req.params.id as string);   
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });// Send a bad request response if the user ID is not a valid number
    }   
    try {
        const result=await UsersServices.deleteUserById(id);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });// Send a not found response if the user is not found
        }
        res.status(200).json({ message: 'User deleted successfully'     });// Send a success response to the client with the result of the user deletion
    } catch (error: any) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });// Send an error response to the client
    }
}
export const updateUserById=async(req:Request,res:Response)=>{
    const id= parseInt(req.params.id as string);    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });// Send a bad request response if the user ID is not a valid number
    }   
    const User=req.body;// Extract the updated user data from the request body
    try {
        const result=await UsersServices.updateUserById(id,User);// Call the updateUserById method from the UsersService to update a user by their ID in the database
        if (!result) {
            return res.status(404).json({ error: 'User not found' });// Send a not found response if the user is not found
        }   
        res.status(200).json({ message: 'User updated successfully' });// Send a success response to the client with the result of the user update
    } catch (error: any) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });// Send an error response to the client
    }   
};


    export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await UsersServices.loginUsers(email, password);
        res.status(200).json(result)
    } catch (error: any) {
        console.error("Login error:", error.message); // Add this
        console.error("Full error object:", error); // Add this
        
        if (error.message === 'User not found') {
            res.status(404).json({ error: error.message });
        } else if (error.message === 'Invalid credentials') {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message || "Internal server error" }); // Return actual error
        }
    }
}
    export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: 'Email and code are required' });
        }
        const result = await UsersServices.verifyUser(email, code);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'User not found') {
            res.status(404).json({ message: error.message });
        } else if (error.message === 'Invalid verification code') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
}

export const resendVerification = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        // Generate new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Update user with new code
        await UsersRepository.setVerificationCode(email, verificationCode);
        
        // Resend email with new code
        await sendEmail(
            email,
            'New Verification Code - Smart Laundry',
            `Your new verification code is: ${verificationCode}`
        );
        
        res.status(200).json({ message: 'Verification code resent successfully' });
    } catch (error: any) {
        console.error('Error resending verification:', error);
        res.status(500).json({ error: 'Failed to resend verification code' });
    }
};