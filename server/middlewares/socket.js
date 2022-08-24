const fs = require("fs");
const path = require("path");
const JWT = require("jsonwebtoken");

const { isProduction } = require("../utils/config");
const keys = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../utils/keys/keys.json"))
);

const checkSocketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error("Auth error");
    const payload = JWT.verify(token, keys.ACCESS_SECRET);

    socket.user = payload.sub;
    console.log("========== Socket User ==========");
    console.log(socket.user);
    return next();
  } catch (err) {
    console.log({ socketErr: err });
    next(err);
  }
};

const safeSocket =
  (handler) =>
  (io, socket) =>
  (...args) => {
    console.log("========== Socket Args ==========");
    console.log(...args);
    Promise.resolve(handler(io, socket)(...args)).catch((err) => {
      console.log("========== Socket Err ==========");
      console.log(err);
      io.emit("error", {
        message: !isProduction
          ? err.message || "An error Occured"
          : "An error Occured",
      });
    });
  };

module.exports = {
  checkSocketAuth,
  safeSocket,
};
