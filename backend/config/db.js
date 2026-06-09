const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense-analyzer', {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('>>> Falling back to Local File-Based Database (No MongoDB required!) <<<');
    global.useMockDb = true;
  }
};

module.exports = connectDB;
