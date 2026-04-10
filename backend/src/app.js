const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use(
	cors({
		origin: allowedOrigins.length > 0 ? allowedOrigins : true,
		credentials: true,
	})
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);

// Serve static frontend files
const path = require("path");
app.use("/client", express.static(path.join(__dirname, "../client"), { index: false }));
app.use("/admin", express.static(path.join(__dirname, "../admin"), { index: false }));

// SPA fallback routing for /client
app.get("/client/*", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/index.html"));
});

// SPA fallback routing for /admin
app.get("/admin/*", (req, res) => {
	res.sendFile(path.join(__dirname, "../admin/index.html"));
});

// Default to client app
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
