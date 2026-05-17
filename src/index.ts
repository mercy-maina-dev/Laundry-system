import { User } from './Types/Users.type';
import express from 'express';

import getPool from './db/config'; 
import { get } from 'node:http'  
import dotenv from 'dotenv';
import UsersRoutes from "./router/Users.routes";
import ServicesRoutes from './router/Services.routes';
import OrdersRoutes from './router/Orders.routes';    

const app = express();// Create an Express application
app.use(express.json());// Middleware to parse JSON request bodies
dotenv.config();// Load environment variables from a .env file  

app.get('/', (req, res) => {
  res.send('Hello, Express server is running!');// Send a response to the client
});

const PORT = process.env.PORT || 8088;// Define the port number for the server to listen on

app.listen(PORT, () => {// Start the server and listen on the specified port
  console.log(`Server is running on port :http://localhost:${PORT}`);// Log a message when the server starts
});



//register routes
UsersRoutes(app);// Register the routes for handling user-related operations
ServicesRoutes(app);// Register the routes for handling service-related operations
OrdersRoutes(app);// Register the routes for handling order-related operations






getPool()// Establish a connection pool to the database
.then(()=>console.log('Database connection pool established successfully.'))// Log a message when the database connection pool is established
.catch((error:any) => console.log('Error establishing database connection ', error));// Log any errors that occur while establishing the database connection pool