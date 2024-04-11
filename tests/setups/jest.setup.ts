import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Connect to the in-memory database
beforeAll(async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  } catch (error) {
    console.log("Error connecting to mongoDB: " + error);
  }
});

// Disconnect and close connection to in-memory database after test completion
afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});
