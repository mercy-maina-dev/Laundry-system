const bcrypt = require('bcrypt');
const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PWD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DB,
  options: { encrypt: false, trustServerCertificate: true }
};

async function hashPasswords() {
  try {
    await sql.connect(config);
    const users = await sql.query`SELECT user_id, password FROM Users`;
    
    for (const user of users.recordset) {
      // If password is not already hashed (doesn't start with $2b$)
      if (!user.password.startsWith('$2b$')) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await sql.query`UPDATE Users SET password = ${hashedPassword} WHERE user_id = ${user.user_id}`;
        console.log(`Updated user ${user.user_id}`);
      }
    }
    
    console.log('All passwords hashed!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

hashPasswords();