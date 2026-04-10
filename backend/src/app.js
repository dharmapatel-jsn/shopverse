const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
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

app.use("/client", express.static(path.join(__dirname, "../client"), { index: false }));
app.use("/admin", express.static(path.join(__dirname, "../admin"), { index: false }));

app.get(/^\/client(?:\/.*)?$/, (req, res) => {
	res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.get(/^\/admin(?:\/.*)?$/, (req, res) => {
	res.sendFile(path.join(__dirname, "../admin/index.html"));
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../client/index.html"));
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
