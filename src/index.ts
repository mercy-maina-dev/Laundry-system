import express from 'express';
import dotenv from 'dotenv';
import getPool from './db/config'; 
import UsersRoutes from "./router/Users.routes";
import ServicesRoutes from './router/Services.routes';
import OrdersRoutes from './router/Orders.routes';  
import OrderItemsRoutes from './router/OrderItems.routes'; 
import DeliveriesRoutes from './router/Deliveries.routes'; 
import mpesaRoutes from "./router/Mpesa.routes";
import PaymentsRoutes from './router/payments.routes';
import OrderStatusHistoryRoutes from './router/OrderStatusHistory.routes';

// Load environment variables FIRST
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.send('Hello, Express server is running!');
});

// ==========================================
// MOUNT MPESA ROUTES - Choose ONE option:
// ==========================================

// OPTION 1: Mount at /mpesa (your current setup)
app.use("/mpesa", mpesaRoutes);

// OPTION 2: Mount at /api/mpesa (more standard)
// app.use("/api/mpesa", mpesaRoutes);

// Register other routes (they use the function pattern)
UsersRoutes(app);
ServicesRoutes(app);
OrdersRoutes(app);
OrderItemsRoutes(app);
DeliveriesRoutes(app);
PaymentsRoutes(app);
OrderStatusHistoryRoutes(app);
const PORT = process.env.PORT || 8088;

app.listen(PORT, () => {
  console.log(`\n✅ Server is running on http://localhost:${PORT}`);
  console.log(`\n📱 Available M-Pesa Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/mpesa/token`);
  console.log(`   POST http://localhost:${PORT}/mpesa/stkpush`);
  console.log(`   POST http://localhost:${PORT}/mpesa/callback`);
  console.log(`\n🏥 Health check: http://localhost:${PORT}/\n`);
});

// Database connection
getPool()
  .then(() => console.log('✅ Database connection pool established successfully.'))
  .catch((error: any) => console.error('❌ Error establishing database connection:', error));