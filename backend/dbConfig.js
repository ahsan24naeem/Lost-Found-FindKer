import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false, // Optional for local testing
    trustServerCertificate: true, // Bypass SSL certificates
  }
};

const connectDB = async () => {
  try {
    let pool = await sql.connect(config);
    console.log('✅ MSSQL Database Connected');
    return pool;
  } catch (err) {
    console.error('❌ MSSQL Connection Failed', err);
  }
};

export default connectDB;
