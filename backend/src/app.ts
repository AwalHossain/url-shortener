import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";

import mongoose from "mongoose";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import validateRequest from "./app/middlewares/validateRequest";
import { UrlController } from "./app/modules/url/url.controller";
import { UrlValidation } from "./app/modules/url/url.validation";
import router from "./routes";
import { sendResponse } from "./shared/sendResponse";
import { getDbStatusText } from "./utils/common";
const app: Express = express();


app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// health check
app.get("/health", (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState;

  const healthCheck = {
    success: true,
    message: "Server is healthy",
    data: {
      uptime: process.uptime(),
      timestamp: new Date(),
      dbStatus: dbStatus, // 0: disconnected, 1: connected, etc.
      dbStatusText: getDbStatusText(dbStatus),
    },
  };

  sendResponse<typeof healthCheck>(res, {
    success: true,
    message: "Server is healthy",
    data: healthCheck,
    statusCode: 200,
  });
});



// Add the root-level redirect route
app.get(
  "/:shortId",
  validateRequest(UrlValidation.redirectToUrlSchema),
  UrlController.redirectToUrl
);

app.use(`/api/v1`, router);
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
});

export default app;