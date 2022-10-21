require("dotenv").config();
const cors = require("cors");
const http = require("http");
const morgan = require("morgan");
const express = require("express");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const { prisma } = require("./utils/prisma.js");
const { checkSocketAuth } = require("./middlewares/socket.js");
const { isProduction, corsOrigin } = require("./utils/config.js");
const { globalErrorHandlerMiddleware } = require("./middlewares/error.js");

const { router: AdminRoutes } = require("./routes/admin.routes");
const { router: AuthRoutes } = require("./routes/auth.routes.js");
const { router: DoctorRoutes } = require("./routes/doctor.routes.js");
const { router: PatientRoutes } = require("./routes/patient.routes.js");
const { router: InventoryRoutes } = require("./routes/inventory.routes");
const { router: ReceptionRoutes } = require("./routes/reception.routes.js");
const { router: PharmacyRoutes } = require("./routes/pharmacy.routes.js");

const { router: socketHandler } = require("./routes/sockets/index.js");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.use(checkSocketAuth);

io.on("connection", (socket) => {
  const data = {
    socket_status: "connected",
    socketId: socket.id,
    userId: socket.user.id,
  };

  socket.on("connect", () => console.log(data));
  return socketHandler(io, socket);
});

app.use(cors({ origin: corsOrigin, optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.send("Hello World");
});
app.use((req, res, next) => {
  setTimeout(next, 300);
});

app.use("/api/auth", AuthRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/doctor", DoctorRoutes);
app.use("/api/patient", PatientRoutes);
app.use("/api/reception", ReceptionRoutes);
app.use("/api/inventory", InventoryRoutes);
app.use("/api/pharmacy", PharmacyRoutes);

app.get("/health", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    return res.status(200).send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    return res.status(503).send(healthcheck);
  }
});

app.use(globalErrorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    instrument(io, { auth: false });
    if (isProduction) console.log = () => {};

    await prisma.$connect();
    console.log("Connection established successfully");
    server.listen(PORT, () =>
      console.log(`Server on http://localhost:${PORT}`)
    );
  } catch (err) {
    await prisma.$disconnect();
    console.log(err);
    process.exit(1);
  }
};

startServer();
