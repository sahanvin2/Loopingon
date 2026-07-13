import express, { type Request, type Response, type NextFunction } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { AppError, errorHandler } from "./middleware/errorHandler.middleware.js";
import { prisma } from "./config/database.js";
import routes from "./routes/index.js";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Kandyam API",
    version: "1.0.0",
    description: "Multi-vendor marketplace API",
  },
  servers: [{ url: "/api/v1", description: "API v1" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {},
};

export function createApp() {
  const app = express();
  app.set("trust proxy", true);

  app.use(helmet());
  app.use(compression());
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://165.227.90.181",
    "https://kandyam.com",
    "https://www.kandyam.com"
  ];
  if (process.env.CORS_ORIGIN) {
    allowedOrigins.push(...process.env.CORS_ORIGIN.split(",").map(o => o.trim()));
  }

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  if (process.env.NODE_ENV !== "test") {
    app.use(
      morgan(
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
        {
          stream: {
            write: (message: string) => {
              const winstonLogger = require("./middleware/errorHandler.middleware.js").logger;
              winstonLogger.info(message.trim());
            },
          },
        }
      )
    );
  }

  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  app.get("/favicon.ico", (_req: Request, res: Response) => {
    res.status(204).end();
  });

  app.get("/health/db", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ok", database: "connected" });
    } catch (err) {
      res.status(503).json({ status: "error", database: "disconnected" });
    }
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use("/api/v1", routes);

  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError("Not Found", 404, "NOT_FOUND"));
  });

  app.use(errorHandler);

  return app;
}
