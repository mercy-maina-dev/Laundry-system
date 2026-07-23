const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.SQL_SERVER,
    user: process.env.SQL_USER,
    password: process.env.SQL_PWD,
    database: process.env.SQL_DB,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

console.log('🔍 Testing connection to Somee.com...');

sql.connect(config).then(() => {
    console.log('✅ Database connected successfully!');
    process.exit(0);
}).catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
});