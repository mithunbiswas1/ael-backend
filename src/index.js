import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
dotenv.config();

const PORT = process.env.PORT || 8000;

import { seedDefaultRoles } from "./db/seedRoles.js";
import { startBackgroundScheduler } from "./utils/scheduler.service.js";

connectDB()
  .then(async () => {
    await seedDefaultRoles();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port:${PORT}`);
      startBackgroundScheduler();
    });

    // Support large video file uploads (up to 1GB) with 15-minute socket/request timeouts
    server.timeout = 15 * 60 * 1000; // 15 minutes (900,000 ms)
    server.requestTimeout = 15 * 60 * 1000; // 15 minutes
    server.keepAliveTimeout = 65 * 1000; // 65 seconds
    server.headersTimeout = 70 * 1000; // 70 seconds
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
  });
// server restart trigger: connected to live mongodb server (209.74.87.115)
