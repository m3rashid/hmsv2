import express from "express";
import "dotenv/config";
import cors from "cors";
import db from "./models/index.js";
// import http from "http";

// import socketHandler from "./routes/index.js";
import AuthRoutes from "./routes/auth.js";
// TODO add a production client here after deployment
const corsOrigin =
  process.env.NODE_ENV === "PROD"
    ? "http://localhost:3000"
    : "http://localhost:3000";
const PORT = process.env.PORT || 5000;

const app = express();
// const server = http.createServer(app);
// const io = require("socket.io")(server, {
//   cors: {
//     origin: corsOrigin,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });
// io.on("connection", (socket) => socketHandler(io, socket));

app.use(cors({ origin: corsOrigin, optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => res.send("Hello World"));
app.use("/api/auth", AuthRoutes);

(async () => {
  try {
    await db.sequelize.authenticate({
      logging: process.env.NODE_ENV !== "PROD",
    });
    console.log("Connection has been established successfully");
    app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
