import { request } from "express";
import getpool from "../db/config";
import { NewUser, User } from "../Types/Users.type";
import { pool } from "mssql";

/**
 * Get all users from the database
 */
export const getAllUsers = async () => {
    const pool = await getpool();
    const results = await pool.request().query('SELECT * FROM Users');
    return results.recordset;
};

/**
 * Create a new user
 * Returns the new user's ID along with a success message
 */
export const createUser = async (User: NewUser) => {
    const pool = await getpool();
    const result = await pool.request()
        .input('full_name', User.full_name)
        .input('email', User.email)
        .input('phone', User.phone)
        .input('password', User.password)
        .input('role', User.role)
        .query(`
            INSERT INTO Users (full_name, email, phone, password, role, is_verified)
            VALUES (@full_name, @email, @phone, @password, @role, 0);
            SELECT SCOPE_IDENTITY() AS user_id;
        `);
    
    return {
        message: 'User added successfully',
        user_id: result.recordset[0]?.user_id
    };
};

/**
 * Get a user by their ID
 */
export const getUserById = async (id: number): Promise<User | null> => {
    const pool = await getpool();
    const result = await pool
        .request()
        .input('id', id)
        .query('SELECT * FROM Users WHERE user_id = @id');
    return result.recordset[0] || null;
};

/**
 * Delete a user and all related data (orders, payments, etc.)
 * Uses individual DELETE statements with subqueries for better compatibility
 */
export const deleteUserById = async (id: number) => {
    const pool = await getpool();

    try {
        // 1. Unassign driver from Orders
        await pool.request()
            .input('id', id)
            .query('UPDATE Orders SET assigned_driver_id = NULL WHERE assigned_driver_id = @id');

        // 2. Delete PickupDelivery records where driver is this user
        await pool.request()
            .input('id', id)
            .query('DELETE FROM PickupDelivery WHERE driver_id = @id');

        // 3. Delete Deliveries where driver is this user
        await pool.request()
            .input('id', id)
            .query('DELETE FROM Deliveries WHERE driver_id = @id');

        // 4. Delete OrderItems linked to user's orders
        await pool.request()
            .input('id', id)
            .query(`
                DELETE FROM OrderItems
                WHERE order_id IN (SELECT order_id FROM Orders WHERE user_id = @id)
            `);

        // 5. Delete Payments linked to user's orders
        await pool.request()
            .input('id', id)
            .query(`
                DELETE FROM Payments
                WHERE order_id IN (SELECT order_id FROM Orders WHERE user_id = @id)
            `);

        // 6. Delete OrderStatusHistory linked to user's orders
        await pool.request()
            .input('id', id)
            .query(`
                DELETE FROM OrderStatusHistory
                WHERE order_id IN (SELECT order_id FROM Orders WHERE user_id = @id)
            `);

        // 7. Delete any remaining deliveries linked to orders (just in case)
        await pool.request()
            .input('id', id)
            .query(`
                DELETE FROM Deliveries
                WHERE order_id IN (SELECT order_id FROM Orders WHERE user_id = @id)
            `);

        // 8. Delete any remaining pickup/delivery records linked to orders
        await pool.request()
            .input('id', id)
            .query(`
                DELETE FROM PickupDelivery
                WHERE order_id IN (SELECT order_id FROM Orders WHERE user_id = @id)
            `);

        // 9. Delete Orders
        await pool.request()
            .input('id', id)
            .query('DELETE FROM Orders WHERE user_id = @id');

        // 10. Delete CustomerFeedback (as customer or driver)
        await pool.request()
            .input('id', id)
            .query(`
                DELETE FROM CustomerFeedback 
                WHERE customer_id = @id OR driver_id = @id
            `);

        // 11. Delete driver live tracking records
        await pool.request()
            .input('id', id)
            .query('DELETE FROM DriverLiveTracking WHERE driver_id = @id');

        // 12. Delete driver route history
        await pool.request()
            .input('id', id)
            .query('DELETE FROM DriverRoutes WHERE driver_id = @id');

        // 13. Finally delete the user
        const result = await pool.request()
            .input('id', id)
            .query('DELETE FROM Users WHERE user_id = @id');

        if (result.rowsAffected[0] === 0) {
            throw new Error('User not found');
        }

        return { 
            success: true, 
            message: 'User and all associated data deleted successfully' 
        };
    } catch (error: any) {
        console.error('Error deleting user:', error.message);
        throw new Error('Failed to delete user: ' + error.message);
    }
};

/**
 * Update a user's information
 */
export const updateUserById = async (id: number, User: User) => {
    const pool = await getpool();
    const result = await pool
        .request()
        .input('id', id)
        .input('full_name', User.full_name)
        .input('email', User.email)
        .input('phone', User.phone)
        .input('password', User.password)
        .input('role', User.role)
        .query(`
            UPDATE Users 
            SET full_name = @full_name, 
                email = @email, 
                phone = @phone, 
                password = @password, 
                role = @role 
            WHERE user_id = @id
        `);
    
    if (result.rowsAffected[0] === 0) {
        return null;
    }
    return { message: 'User updated successfully' };
};

/**
 * Set the verification code for a user
 */
export const setVerificationCode = async (email: string, code: string) => {
    const pool = await getpool();
    await pool
        .request()
        .input('email', email)
        .input('code', code)
        .query(`
            UPDATE Users 
            SET verification_code = @code, is_verified = 0 
            WHERE email = @email
        `);
    return { message: 'Verification code saved' };
};

/**
 * Verify a user (set is_verified = 1 and clear the verification code)
 */
export const verifyUser = async (email: string) => {
    const pool = await getpool();
    await pool
        .request()
        .input("email", email)
        .query(`
            UPDATE Users
            SET is_verified = 1, verification_code = NULL
            WHERE email = @email
        `);
    return { message: "User verified successfully" };
};

/**
 * Get a user by their email address
 */
export const getUserByEmail = async (email: string) => {
    const pool = await getpool();
    const result = await pool.request()
        .input("email", email)
        .query(`
            SELECT * FROM Users
            WHERE email = @email
        `);
    return result.recordset[0] || null;
};

/**
 * Get a user by their phone number
 */
export const getUserByPhone = async (phone: string) => {
    const pool = await getpool();
    const result = await pool.request()
        .input("phone", phone)
        .query(`
            SELECT * FROM Users
            WHERE phone = @phone
        `);
    return result.recordset[0] || null;
};