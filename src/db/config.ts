import dotenv, { config } from 'dotenv';// Load environment variables from .env file
import assert from 'assert';//just to make sure all the required environment variables are present before proceeding with the application logic
import sql, { pool } from 'mssql';// Import the mssql library to interact with Microsoft SQL Server databases
dotenv.config();// Load environment variables from .env file

const{
    SQL_SERVER,
    SQL_USER,
    SQL_PWD,
    SQL_DB,
    PORT
} = process.env;// Destructure environment variables

//Ensure all required environment variables are present
assert(SQL_SERVER, 'SQL_SERVER is required');
assert(SQL_USER, 'SQL_USER is required');
assert(SQL_PWD, 'SQL_PWD is required');
assert(SQL_DB, 'SQL_DB is required');
assert(PORT, 'PORT is required');

//CONFIGURATION OBJECT FOR DATABASE CONNECTION
export const dbConfig = {
    PORT: PORT,
    sqlConfig: {
    server: SQL_SERVER,
    user: SQL_USER,   
    password: SQL_PWD,
    database: SQL_DB,
    //pool is used to manage multiple connections efficiently
    pool:{
        max:15,
        min:0,
        idleTimeoutMillis:30000
    },
    options:{   
        encrypt: true, // Use encryption for secure connections
        trustServerCertificate: true // Trust the server certificate (useful for development)
    }
}

};

export const getpool=async()=>{
    try {
        const pool=await sql.connect(dbConfig.sqlConfig);
        return pool;// Establish a connection pool to the database
}catch (error) {
    console.error('Error connecting to the database:', error);// Log the error for debugging purposes
    throw error; // Rethrow the error after logging it  
}
}
export default getpool;// Export the getPool function as the default export of this module  
