import { User } from '../Types/Users.type';

declare global {
    namespace Express {
        interface Request {
            user?: {
                user_id: number;
                full_name: string;
                role: string;
                email?: string;
            };
        }
    }
}