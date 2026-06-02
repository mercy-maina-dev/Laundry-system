import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketServer;

interface DriverLocation {
    driver_id: number;
    order_id: number;
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
}

interface UserSocket {
    user_id: number;
    user_type: 'customer' | 'driver' | 'admin';
    socket_id: string;
}

const connectedUsers = new Map<string, UserSocket>();
const driverLocations = new Map<number, DriverLocation>();

export const initializeSocket = (server: HttpServer) => {
    io = new SocketServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('New client connected:', socket.id);

        // User registers their connection
        socket.on('register', (data: { user_id: number, user_type: string }) => {
            connectedUsers.set(socket.id, {
                user_id: data.user_id,
                user_type: data.user_type as any,
                socket_id: socket.id
            });
            
            console.log(`User ${data.user_id} (${data.user_type}) registered`);
            
            // Send confirmation
            socket.emit('registered', { 
                success: true, 
                message: `Connected as ${data.user_type}` 
            });
        });

        // Driver shares location
        socket.on('driver-location', async (data: DriverLocation) => {
            const { driver_id, order_id, latitude, longitude, speed, heading } = data;
            
            // Store latest location
            driverLocations.set(driver_id, data);
            
            // Broadcast to customer tracking this order
            socket.to(`order-${order_id}`).emit('driver-location-update', {
                driver_id,
                latitude,
                longitude,
                speed,
                heading,
                timestamp: new Date()
            });
            
            // Also emit to admin dashboard for monitoring
            io.to('admin-room').emit('all-driver-locations', Array.from(driverLocations.values()));
        });

        // Customer joins order room to track driver
        socket.on('track-order', (data: { order_id: number, customer_id: number }) => {
            socket.join(`order-${data.order_id}`);
            console.log(`Customer ${data.customer_id} is tracking order ${data.order_id}`);
            
            socket.emit('joined-tracking', {
                success: true,
                message: `Now tracking order ${data.order_id}`
            });
        });

        // Driver joins order room for their assignments
        socket.on('driver-assigned', (data: { order_id: number, driver_id: number }) => {
            socket.join(`order-${data.order_id}`);
            socket.join(`driver-${data.driver_id}`);
            console.log(`Driver ${data.driver_id} assigned to order ${data.order_id}`);
        });

        // Driver started pickup
        socket.on('driver-started-pickup', (data: { order_id: number, driver_id: number, eta: number }) => {
            io.to(`order-${data.order_id}`).emit('pickup-started', {
                driver_id: data.driver_id,
                status: 'ON_THE_WAY',
                eta: data.eta,
                message: 'Driver is on the way for pickup',
                timestamp: new Date()
            });
        });

        // Driver arrived at pickup
        socket.on('driver-arrived-pickup', (data: { order_id: number, driver_id: number }) => {
            io.to(`order-${data.order_id}`).emit('driver-arrived', {
                driver_id: data.driver_id,
                type: 'PICKUP',
                message: 'Driver has arrived for pickup',
                timestamp: new Date()
            });
        });

        // Pickup completed
        socket.on('pickup-completed', (data: { order_id: number, driver_id: number }) => {
            io.to(`order-${data.order_id}`).emit('pickup-completed', {
                driver_id: data.driver_id,
                message: 'Items have been picked up',
                timestamp: new Date()
            });
            
            // Notify admin
            io.to('admin-room').emit('order-updated', {
                order_id: data.order_id,
                status: 'PICKED_UP',
                timestamp: new Date()
            });
        });

        // Driver started delivery
        socket.on('driver-started-delivery', (data: { order_id: number, driver_id: number, eta: number }) => {
            io.to(`order-${data.order_id}`).emit('delivery-started', {
                driver_id: data.driver_id,
                status: 'OUT_FOR_DELIVERY',
                eta: data.eta,
                message: 'Your order is out for delivery',
                timestamp: new Date()
            });
        });

        // Driver arrived at delivery
        socket.on('driver-arrived-delivery', (data: { order_id: number, driver_id: number }) => {
            io.to(`order-${data.order_id}`).emit('driver-arrived', {
                driver_id: data.driver_id,
                type: 'DELIVERY',
                message: 'Driver has arrived with your order',
                timestamp: new Date()
            });
        });

        // Delivery completed
        socket.on('delivery-completed', (data: { order_id: number, driver_id: number }) => {
            io.to(`order-${data.order_id}`).emit('delivery-completed', {
                driver_id: data.driver_id,
                message: 'Your order has been delivered',
                timestamp: new Date()
            });
            
            io.to('admin-room').emit('order-updated', {
                order_id: data.order_id,
                status: 'DELIVERED',
                timestamp: new Date()
            });
        });

        // Order status change
        socket.on('order-status-change', (data: { order_id: number, status: string, message: string }) => {
            io.to(`order-${data.order_id}`).emit('status-changed', {
                status: data.status,
                message: data.message,
                timestamp: new Date()
            });
        });

        // Admin joins admin room
        socket.on('admin-join', (data: { admin_id: number }) => {
            socket.join('admin-room');
            console.log(`Admin ${data.admin_id} joined admin room`);
            
            // Send all current driver locations
            socket.emit('all-driver-locations', Array.from(driverLocations.values()));
        });

        // Customer sends message to driver
        socket.on('customer-message', (data: { order_id: number, customer_id: number, driver_id: number, message: string }) => {
            io.to(`driver-${data.driver_id}`).emit('new-message', {
                order_id: data.order_id,
                from: 'customer',
                message: data.message,
                timestamp: new Date()
            });
        });

        // Driver sends message to customer
        socket.on('driver-message', (data: { order_id: number, driver_id: number, customer_id: number, message: string }) => {
            io.to(`order-${data.order_id}`).emit('new-message', {
                order_id: data.order_id,
                from: 'driver',
                message: data.message,
                timestamp: new Date()
            });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            const user = connectedUsers.get(socket.id);
            if (user) {
                console.log(`User ${user.user_id} (${user.user_type}) disconnected`);
                connectedUsers.delete(socket.id);
                
                // Remove driver location if they disconnect
                if (user.user_type === 'driver') {
                    driverLocations.delete(user.user_id);
                    io.to('admin-room').emit('driver-disconnected', { driver_id: user.user_id });
                }
            }
        });
    });

    return io;
};

export const getSocketIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
};

// Function to emit order update from outside socket
export const emitOrderUpdate = (order_id: number, event: string, data: any) => {
    if (io) {
        io.to(`order-${order_id}`).emit(event, data);
    }
};

// Function to notify driver of new assignment
export const notifyDriverAssignment = (driver_id: number, order_id: number, pickup_location: string) => {
    if (io) {
        io.to(`driver-${driver_id}`).emit('new-assignment', {
            order_id,
            pickup_location,
            assigned_at: new Date()
        });
    }
};