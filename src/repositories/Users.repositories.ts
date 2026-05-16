
import { request } from "express";
import getpool from "../db/config";
import { NewUser, User } from "../Types/Users.type";

//get all users
export const getAllUsers=async()=>{
    const pool= await getpool();
    const results=await pool.request().query('SELECT * FROM Users');
    return results.recordset;
}
//ading users
export const createUser=async(User:NewUser)=>{
    const pool=await getpool();//opening connection to the database
        await pool.request()//creating a new request to the database
        .input('full_name',User.full_name)
        .input('email',User.email)
        .input('phone',User.phone)
        .input('password',User.password)
        .input('role',User.role)
        .query('INSERT INTO Users (full_name, email, phone, password, role) VALUES (@full_name, @email, @phone, @password, @role)')//executing the SQL query to insert a new user into the database
        return{ message: 'User added successfully' };//returning a success message after the user has been added to the database
}

//get User by id
export const getUserById=async(id:number):Promise<User| null>=>{
    const pool= await getpool();
    const result=await pool
    .request()
    .input('id', id)
    .query('SELECT * FROM Users WHERE user_id = @id');
    return result.recordset[0] || null;
};

//deleting users by id
export const deleteUserById=async(id:number)=>{
    const pool= await getpool();
    const result=await pool
    .request()
    .input('id', id)
    .query('DELETE FROM Users WHERE user_id = @id');
    if (result.rowsAffected[0] === 0) {
        return null;

    }  
    return { message: 'User deleted successfully' };
};

//updte user by id
export const updateUserById=async(id:number,User:User)=>{
    const pool= await getpool();
    const result=await pool 
    .request()
    .input('id', id)
    .input('full_name',User.full_name)      
    .input('email',User.email)
    .input('phone',User.phone)
    .input('password',User.password)
    .input('role',User.role)
    .query('UPDATE Users SET full_name = @full_name, email = @email, phone = @phone, password = @password, role = @role WHERE user_id = @id');
    if (result.rowsAffected[0] === 0) {
        return null;
    } 
    return { message: 'User updated successfully' };
};