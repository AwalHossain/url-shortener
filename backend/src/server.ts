// always suggest for typescript
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";

import config from "./config/config";
import connectDB from "./config/db";
import { errorLogger, logger } from "./shared/logger";

const PORT = Number(config.port) || 8001;
export let server = http.createServer(app);

async function bootstrap() {
  try {
    await connectDB();
    logger.info("Database connected successfully");

    server = app.listen(PORT, () => {
      logger.info(`listening on port ${PORT}`);
      console.log("listening on port", PORT);
      logger.info("application setup completed successfully");
      logger.info("application started", new Date().toTimeString());
    });
  } catch (error) {
    errorLogger.error("Failed to bootstrap application", error);
    process.exit(1);
  }
}

bootstrap();