var hostName = "http://localhost:3000";
if (process.env.ENV === "PROD") {
  // TODO, fill in deployed URL
  hostName = "http://localhost:3000";
}
exports.hostName = hostName;
