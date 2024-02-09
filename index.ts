import process from "process";
import mongoose from "mongoose";
import config from "./config";
import app from "./app";

process.on("uncaughtExceptiion", (err: any) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION SHUTTING DOWN.....");
  process.exit(1);
});

const port = config.PORT || 8100;

const URI = config.DATABASE.replace("<PASSWORD>", config.DATABASE_PASSWORD);

mongoose.connect(URI).then(() => {
  console.log("Database connection successful");
});

const server = app.listen(port, () => {
  console.log(
    `${config.APP_NAME} App listening on port ${port} in ${config.NODE_ENV} mode`
  );
});

process.on("unhandledRejection", (err: any) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION, SHUTTING DOWN ....");
  server.close(() => {
    process.exit(1);
  });
});
