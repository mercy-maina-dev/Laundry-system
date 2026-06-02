//import { loginUsers } from './../Services/Users.Services';
//import { loginUser } from './Users.controllers';
import { User } from './../Types/Users.type';

    import { Request,Response } from "express";
    import getpool from "../db/config";//establish a connection pool to the database
    import * as UsersServices from '../Services/Users.Services';// Import all functions from the UsersService module to handle business logic related to users

export const getAllUsers=async(req:Request,res:Response)=>{ 
    try {
        const Users =await UsersServices.getAllUsers();// Call the getAllUsers method from the UsersService to retrieve all users from the database
        res.status(200).json({Users});
    } catch (error: any) {
        console.error('Error retrieving users:', error);
        res.status(500).json({error:'Internal server error'});// Send an error response to the client
    }
}
        
export const createUser=async(req:Request,res:Response)=>{
    const User=req.body;// Extract the  user data from the request body
    try {
        const result=await UsersServices.createUser(User);// Call the createUser method from the UsersService to add a new user to the database
        res.status(201).json(result);// Send a success response to the client with the result of the user creation
    } catch (error: any) {
        console.error('Error creating user:', error);
        console.log("BODY RECEIVED:", req.body);
        res.status(500).json({error:'Internal server error'});// Send an error response to the client
    }
}

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


    export const loginUser= async(req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const result = await UsersServices.loginUsers(email, password);
            res.status(200).json(result)
        } catch (error: any) {
            if (error.message === 'User not found') {
                res.status(404).json ({ error: error.message });
            } else if (error.message === 'Invalid credentials') {
                res.status(401).json({error: error.message});
            } else {
                res.status(500).json({ error: "Internal server error" });
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