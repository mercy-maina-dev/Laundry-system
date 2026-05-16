import { Express } from "express";
import * as UsersControllers from '../controllers/Users.controllers';// Import all functions from the UsersControllers module to handle user-related operations

const getAllUsersRoutes=(app:Express)=>{
    app.get('/user',UsersControllers.getAllUsers);// Define a route for retrieving all users and associate it with the getAllUsers controller function
    app.post('/adduser',UsersControllers.createUser);
    app.get('/user/:id',UsersControllers.getUserById);
    app.delete('/user/:id',UsersControllers.deleteUserById);
    app.put('/user/:id',UsersControllers.updateUserById);
}
export default getAllUsersRoutes;// Export the getAllUsersRoutes function as the default export of this module 
