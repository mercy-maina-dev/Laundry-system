import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
    id: number;
    role: "admin" | "customer" | "driver";
}

export const checkRoles = (requiredRole: "admin" | "customer" | "driver") => {
    return (req: Request, res: Response, next: NextFunction) => {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            ) as JwtPayload;

            // attach user to request
            (req as any).user = decoded;

            if (decoded.role !== requiredRole) {
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }

            next();

        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};
export const adminOnly = checkRoles("admin")
export const customerOnly = checkRoles("customer")
export const driverOnly = checkRoles("driver")
//export const admincustomer = checkRoles("both")
