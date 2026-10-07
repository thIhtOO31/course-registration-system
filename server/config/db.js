const mongoose = require("mongoose");
const dns = require("node:dns");

// Use public DNS to resolve MongoDB Atlas SRV records (prevents EBADRESP errors on local Wi-Fi/routers)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;