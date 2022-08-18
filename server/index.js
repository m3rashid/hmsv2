require("dotenv").config();
const fs = require("fs");
const cors = require("cors");
const http = require("http");
const express = require("express");
const JWT = require("jsonwebtoken");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const morgan = require("morgan");

const prisma = require("./utils/prisma.js");
const { router: AuthRoutes } = require("./routes/auth.routes.js");
const { router: DoctorRoutes } = require("./routes/doctor.routes.js");
const { router: socketHandler } = require("./routes/sockets/index.js");
const { router: PatientRoutes } = require("./routes/patient.routes.js");
const { router: InventoryRoutes } = require("./routes/inventory.routes");
const { router: ReceptionRoutes } = require("./routes/reception.routes.js");

const keys = JSON.parse(fs.readFileSync(__dirname + "/utils/keys/keys.json"));

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
    methods: ["GET", "POST", "HEAD", "OPTIONS"],
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error("Auth error");
    const payload = JWT.verify(token, keys.ACCESS_SECRET);

    socket.user = payload.sub;

    return next();
  } catch (err) {
    console.log({ socketErr: err });
    next(err);
  }
});

io.on("connection", (socket) => {
  console.log("socket connected : ", socket.id, socket.user.id);
  socket.on("connect", () => {
    console.log("connected : ", socket.id, socket.user.id);
  });
  return socketHandler(io, socket);
});

app.use(cors({ origin: corsOrigin, optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
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
    if (process.env.NODE_ENV === "production") console.log = () => {};

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
