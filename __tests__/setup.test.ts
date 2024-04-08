import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Connect to the in-memory database
beforeAll(async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// Disconnect and close connection to in-memory database after test completion
afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
});
