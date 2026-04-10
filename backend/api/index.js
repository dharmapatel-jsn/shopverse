const app = require("../src/app");
const { connectDB } = require("../src/config/db");

let dbConnectionPromise;

module.exports = async (req, res) => {
  try {
    if (!dbConnectionPromise) {
      dbConnectionPromise = connectDB();
    }

    await dbConnectionPromise;
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Server failed to initialize",
      error: error.message,
    });
  }
};