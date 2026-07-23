console.log(' index.ts is being executed...');
process.on('unhandledRejection', (reason, promise) => {
    console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (error) => {
    console.error(' Uncaught Exception:', error);
});

import express from 'express';
import dotenv from 'dotenv';
import getPool from './db/config'; 
import http from 'http';
import cors from 'cors';
import { initializeSocket } from './socket/socket.server';
import UsersRoutes from "./router/Users.routes";
import ServicesRoutes from './router/Services.routes';
import OrdersRoutes from './router/Orders.routes';  
import OrderItemsRoutes from './router/OrderItems.routes'; 
import DeliveriesRoutes from './router/Deliveries.routes'; 
import mpesaRoutes from "./router/Mpesa.routes";
import PaymentsRoutes from './router/payments.routes';
import OrderStatusHistoryRoutes from './router/OrderStatusHistory.routes';
import PickupDeliveryRoutes from './router/pickupDelivery.routes';
import feedbackRoutes from "./router/feedback.routes";
import StoreSettingsRoutes from './router/StoreSettings.routes';
import getGeofenceZonesRoutes from './router/GeofenceZones.routes';
import getDriverRoutesRoutes from './router/driverRoutes.routes';
import settingsRoutes from './router/Settings.routes';

//  environment variables 
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO with the HTTP server
const io = initializeSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.send('Hello, Express server is running!');
});

//mpesa routes
app.use("/mpesa", mpesaRoutes);


const apiRouter = express.Router();

//all routes
UsersRoutes(apiRouter);
ServicesRoutes(apiRouter);
OrdersRoutes(apiRouter);
OrderItemsRoutes(apiRouter);
DeliveriesRoutes(apiRouter);
PaymentsRoutes(apiRouter);
OrderStatusHistoryRoutes(apiRouter);
PickupDeliveryRoutes(apiRouter);
feedbackRoutes(apiRouter);
StoreSettingsRoutes(apiRouter);
getGeofenceZonesRoutes(apiRouter);
getDriverRoutesRoutes(apiRouter);
settingsRoutes(apiRouter);

// Mount everything under /api
app.use('/api', apiRouter);

// ==========================================

const PORT = process.env.PORT || 8088;

app.listen(PORT, () => {
  console.log(`\n Server is running on http://localhost:${PORT}`);
  console.log(`\n Health check: http://localhost:${PORT}/\n`);
  console.log(`\n API routes available at: http://localhost:${PORT}/api`);
});

// Database connection
getPool()
  .then(() => console.log(' Database connection pool established successfully.'))
  .catch((error: any) => console.error(' Error establishing database connection:', error));