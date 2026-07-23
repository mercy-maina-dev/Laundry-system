import { loginUsers } from './../Services/Users.Services';
import { verifyUser } from './../Services/Users.Services';  
import express from "express";
import * as UsersControllers from '../controllers/Users.controllers';
import { adminOnly, customerOnly, driverOnly } from "../middleware/UsersAuth";
import { verify } from "jsonwebtoken";

const getAllUsersRoutes = (router: express.Router) => {
    router.get('/admin/users', UsersControllers.getAllUsers);
    router.post('/adduser', UsersControllers.createUser);
    router.get('/user/:id', UsersControllers.getUserById);
    router.delete('/user/:id', UsersControllers.deleteUserById);
    router.put('/user/:id', UsersControllers.updateUserById);
    router.post('/login', UsersControllers.loginUser);
    router.post('/verify', UsersControllers.verifyUser);
    router.post('/resend-verification', UsersControllers.resendVerification);
    // router.get('/admin/users', adminOnly, UsersControllers.getAllUsers);
    // router.get('/driver/tasks', driverOnly, UsersControllers.);
    // router.get('/customer/orders', customerOnly, UsersControllers.getCustomerOrders);
}

export default getAllUsersRoutes;