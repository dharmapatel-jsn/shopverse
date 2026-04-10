const app = require("../src/app");
const { connectDB } = require("../src/config/db");

let dbConnectionPromise;

process.env.STATIC_FRONTEND_DIR = __dirname;

module.exports = async (req, res) => {
  try {
    if (req.url === "/api/health") {
      return res.status(200).json({
        success: true,
        message: "Backend is running",
      });
    }

    if (req.url.startsWith("/api")) {
      if (!dbConnectionPromise) {
        dbConnectionPromise = connectDB();
      }

      await dbConnectionPromise;
    }

    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Server failed to initialize",
      error: error.message,
    });
  }
};