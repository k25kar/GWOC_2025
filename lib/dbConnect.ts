import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

async function connect() {
  if (connection.isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {
      serverSelectionTimeoutMS: 30000, // Timeout after 5 seconds
    });
    connection.isConnected = db.connections[0].readyState;
    console.log('DB Connected Successfully');
  } catch (error) {
    console.error('DB Connection Error:', error);
    throw error; // Rethrow the error to ensure it's caught by the API route
  }
}

async function disconnect() {
  if (connection.isConnected) {
    try {
      await mongoose.disconnect();
      connection.isConnected = 0;
      console.log('DB Disconnected Successfully');
    } catch (error) {
      console.error('DB Disconnection Error:', error);
    }
  }
}

const dbConnect = { connect, disconnect };
export default dbConnect;
