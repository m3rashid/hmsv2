import express from "express";
import "dotenv/config";
import cors from "cors";
// import db from "./models/index.js";
import http from "http";
import { Server } from "socket.io";

import models from "./models/index.js";
import AuthRoutes from "./routes/auth.routes.js";
import DoctorRoutes from "./routes/doctor.routes.js";
import socketHandler from "./routes/sockets/index.js";
import PatientRoutes from "./routes/patient.routes.js";
import { instrument } from "@socket.io/admin-ui";

// TODO add a production client here after deployment
const corsOrigin = [
  process.env.NODE_ENV === "production"
    ? "http://localhost:3000"
    : "http://localhost:3000",
  "https://admin.socket.io",
];
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  return socketHandler(io, socket);
});

app.use(cors({ origin: corsOrigin, optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("Hello World"));

if (process.env.NODE_ENV !== "production") {
  app.use("/api/auth", AuthRoutes);
  app.use("/api/patient", PatientRoutes);
  app.use("/api/doctor", DoctorRoutes);
}
const startServer = async () => {
  try {
    instrument(io, {
      auth: false,
    });

    await models.sequelize.authenticate({
      logging: process.env.NODE_ENV !== "production",
    });
    console.log("Connection has been established successfully");
    server.listen(PORT, () =>
      console.log(`Server on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

startServer();
