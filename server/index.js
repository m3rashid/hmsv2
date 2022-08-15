const express = require("express");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const { router: AuthRoutes } = require("./routes/auth.routes.js");
const { router: DoctorRoutes } = require("./routes/doctor.routes.js");
const { router: ReceptionRoutes } = require("./routes/reception.routes.js");
const { router: socketHandler } = require("./routes/sockets/index.js");
const { router: PatientRoutes } = require("./routes/patient.routes.js");
const { router: InventoryRoutes } = require("./routes/inventory.routes");
const prisma = require("./utils/prisma.js");

const corsOrigin = [
  "https://admin.socket.io",
  process.env.NODE_ENV === "production"
    ? "https://ansarihms.surge.sh"
    : "http://localhost:3000",
];

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

app.use("/api/auth", AuthRoutes);
app.use("/api/patient", PatientRoutes);
app.use("/api/doctor", DoctorRoutes);
app.use("/api/reception", ReceptionRoutes);
app.use("/api/inventory", InventoryRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    instrument(io, { auth: false });
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
