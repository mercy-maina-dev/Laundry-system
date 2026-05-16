import { loginUsers } from './../Services/Users.Services';
import { verifyUser } from './../Services/Users.Services';  
import { Express } from "express";
import * as UsersControllers from '../controllers/Users.controllers';// Import all functions from the UsersControllers module to handle user-related operations
import { adminOnly,customerOnly,driverOnly } from "../middleware/UsersAuth";    
import { verify, } from "jsonwebtoken";




const getAllUsersRoutes=(app:Express)=>{
    app.get('/user',UsersControllers.getAllUsers);// Define a route for retrieving all users and associate it with the getAllUsers controller function
    app.post('/adduser',UsersControllers.createUser);
    app.get('/user/:id',UsersControllers.getUserById);
    app.delete('/user/:id',UsersControllers.deleteUserById);
    app.put('/user/:id',UsersControllers.updateUserById);
    app.post('/login',UsersControllers.loginUser);
    app.post('/verify',UsersControllers.verifyUser);



}
export default getAllUsersRoutes;// Export the getAllUsersRoutes function as the default export of this module 
