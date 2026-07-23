import { request } from "express";
import getpool from "../db/config";
import { NewUser, User } from "../Types/Users.type";
import { pool } from "mssql";

//get all users
export const getAllUsers = async () => {
    const pool = await getpool();
    const results = await pool.request().query('SELECT * FROM Users');
    return results.recordset;
}

//adding users
export const createUser = async (User: NewUser) => {
    const pool = await getpool();
    await pool.request()
        .input('full_name', User.full_name)
        .input('email', User.email)
        .input('phone', User.phone)
        .input('password', User.password)
        .input('role', User.role)
        .query('INSERT INTO Users (full_name, email, phone, password, role) VALUES (@full_name, @email, @phone, @password, @role)');
    return { message: 'User added successfully' };
}

//get User by id
export const getUserById = async (id: number): Promise<User | null> => {
    const pool = await getpool();
    const result = await pool
        .request()
        .input('id', id)
        .query('SELECT * FROM Users WHERE user_id = @id');
    return result.recordset[0] || null;
};

export const deleteUserById = async (id: number) => {
    const pool = await getpool();

    // 1. Unassign driver from Orders (assigned_driver_id allows NULL)
    await pool.request()
        .input('id', id)
        .query('UPDATE Orders SET assigned_driver_id = NULL WHERE assigned_driver_id = @id');

    // 2. Delete PickupDelivery records (driver_id is NOT NULL)
    await pool.request()
        .input('id', id)
        .query('DELETE FROM PickupDelivery WHERE driver_id = @id');

    // 3. DELETE Deliveries (driver_id is NOT NULL)
    await pool.request()
        .input('id', id)
        .query('DELETE FROM Deliveries WHERE driver_id = @id');

    // 4. Delete all orders and related records created by the user
    await pool.request()
        .input('id', id)
        .query(`
            -- Delete order items
            DELETE oi FROM OrderItems oi
            INNER JOIN Orders o ON oi.order_id = o.order_id
            WHERE o.user_id = @id;

            -- Delete payments
            DELETE p FROM Payments p
            INNER JOIN Orders o ON p.order_id = o.order_id
            WHERE o.user_id = @id;

            -- Delete order status history
            DELETE oh FROM OrderStatusHistory oh
            INNER JOIN Orders o ON oh.order_id = o.order_id
            WHERE o.user_id = @id;

            -- Delete any other deliveries linked to orders (if any remain)
            DELETE d FROM Deliveries d
            INNER JOIN Orders o ON d.order_id = o.order_id
            WHERE o.user_id = @id;

            -- Delete pickup/delivery records linked to orders (if any remain)
            DELETE pd FROM PickupDelivery pd
            INNER JOIN Orders o ON pd.order_id = o.order_id
            WHERE o.user_id = @id;

            -- Finally delete the orders themselves
            DELETE FROM Orders WHERE user_id = @id;
        `);

    // 5. Now delete the user
    const result = await pool.request()
        .input('id', id)
        .query('DELETE FROM Users WHERE user_id = @id');

    return result;
};

//update user by id
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
        .query('UPDATE Users SET full_name = @full_name, email = @email, phone = @phone, password = @password, role = @role WHERE user_id = @id');
    if (result.rowsAffected[0] === 0) {
        return null;
    }
    return { message: 'User updated successfully' };
};

export const setVerificationCode = async (email: string, code: string) => {
    const pool = await getpool();
    await pool
        .request()
        .input('email', email)
        .input('code', code)
        .query('UPDATE Users SET verification_code = @code, is_verified = 0 WHERE email = @email');
    return { message: 'Verification code saved' };
}

//verify user by setting is_verified to true
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

//get user by email
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