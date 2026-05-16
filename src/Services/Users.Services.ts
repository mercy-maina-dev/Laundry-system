import { User } from './../Types/Users.type';


import * as UsersRepository from '../repositories/Users.repositories';// Import all functions from the UsersRepository module to interact with the database
import dotenv from 'dotenv';
import { NewUser,updateUser } from '../Types/Users.type';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { emailTemplate } from '../mailer/emailTemplates';
//import { sendEmail } from '../mailer/mailer';
import { sendEmail } from '../mailer/mailer';

dotenv.config();// Load environment variables from a .env file

//get all users
export const getAllUsers=async()=> await UsersRepository.getAllUsers();// Call the getAllUsers method from the UsersRepository to retrieve all users from the database
//adding users
export const createUser=async(User:NewUser)=> {
    // Hash the user's password before storing it in the database
    if (User.password) {
        User.password = await bcrypt.hash(User.password, 10);
    }

    // Generate a verification code for email verification
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
    //User.verification_code = verificationCode;
 const result = await UsersRepository.createUser(User);// Call the createUser method from the UsersRepository to add a new user to the database

    // Send a welcome email to the user after successful registration
await UsersRepository.setVerificationCode(User.email, verificationCode); // Store the verification code in the database for later verification
    // 2. Send welcome email using template
    await sendEmail(
        User.email,
        'Verify your email forSmartLaundry pickup and delivery system app',
        emailTemplate.verify(User.full_name, verificationCode),
    );
     return { message: 'User added successfully. Please check your email to verify your account.' };       
            
        
    }

//verify user with emailcode
    export const verifyUser = async (email: string, code:string) => {
    const User = await UsersRepository.getUserByEmail(email);
    if (!User) {
        throw new Error('User not found');
    }

    if (User.verification_code !== code) {
        throw new Error('Invalid verification code');
    }
    await UsersRepository.verifyUser(email);

    //send email to user notifying successful verification
    await sendEmail(
        User.email,
        'Your email has been verified - SmartLaundry pickup and delivery system app',
        emailTemplate.verifiedSuccess(User.full_name)
    )
    return { message: 'User verified successfully' };
}

    


export const getUserById=async(id:number)=> await UsersRepository.getUserById(id);// Call the getUserById method from the UsersRepository to retrieve a user by their ID from the database
export const deleteUserById=async(id:number)=> await UsersRepository.deleteUserById(id);// Call the deleteUserById method from the UsersRepository to delete a user by their ID from the database
// UPDATE USER
export const updateUserById = async (id: number, User: updateUser) => {
    return await UsersRepository.updateUserById(id, User);
};

//login function
export const loginUsers = async (email: string, password:string) => {
    //find user by email
    const user = await UsersRepository.getUserByEmail(email)
    if(!user){
        throw new Error('User not found')
    }

    //compare the passwords 
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Invalid credentials')
    }

//     //compare the passwords
//  //const isMatch = await bcrypt.compare(password, user.password)
//   //  if(!isMatch){
//         throw new Error('Invalid credentials')
//     }
//create a JWT PAYLOAD
  const payload = {
        sub: user.user_id,
        full_name: user.full_name ,
        role: user.role,
        exp: Math.floor(Date.now()/1000 + 60*60)
    }

    //generate a JWT token
    const secret = process.env.JWT_SECRET as string
    if (!secret) throw new Error ('JWT Secret is not defined');

    const token = jwt.sign(payload, secret) //token to use as a card

    //return successful login
    return {
        message: 'Login successful',
        token,
        user: {
            user_id: user.user_id,
            FN: user.full_name,
            email: user.email,
            P: user.phone,
            password: user.password,
            role: user.role
    
        }
    }
}
    
