export interface User {
   full_name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
}

export interface NewUser {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    verification_code: string;
}

export interface updateUser {
    full_name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
}   