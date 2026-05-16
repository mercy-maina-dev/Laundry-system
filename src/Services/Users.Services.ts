

import * as UsersRepository from '../repositories/Users.repositories';// Import all functions from the UsersRepository module to interact with the database
import dotenv from 'dotenv';
import { NewUser,updateUser } from '../Types/Users.type';
dotenv.config();// Load environment variables from a .env file

//get all users
export const getAllUsers=async()=> await UsersRepository.getAllUsers();// Call the getAllUsers method from the UsersRepository to retrieve all users from the database
//adding users
export const createUser=async(User:NewUser)=> {
    return await UsersRepository.createUser(User);
};// Call the createUser method from the UsersRepository to add a new user to the database

export const getUserById=async(id:number)=> await UsersRepository.getUserById(id);// Call the getUserById method from the UsersRepository to retrieve a user by their ID from the database
export const deleteUserById=async(id:number)=> await UsersRepository.deleteUserById(id);// Call the deleteUserById method from the UsersRepository to delete a user by their ID from the database
// UPDATE USER
export const updateUserById = async (id: number, User: updateUser) => {
    return await UsersRepository.updateUserById(id, User);
};