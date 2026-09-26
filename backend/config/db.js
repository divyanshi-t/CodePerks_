const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.error('Make sure MongoDB is running on your machine.');
    // Do not exit - server continues, API calls will gracefully fail
  }
};

module.exports = connectDB;
