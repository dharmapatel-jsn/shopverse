const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const backendRoot = path.resolve(__dirname, "..");

const apps = [
  {
    name: "client-side",
    sourceDir: path.join(repoRoot, "client-side"),
    outputDir: path.join(backendRoot, "client"),
    basePath: "/client/",
  },
  {
    name: "admin-side",
    sourceDir: path.join(repoRoot, "admin-side"),
    outputDir: path.join(backendRoot, "admin"),
    basePath: "/admin/",
  },
];

for (const app of apps) {
  if (fs.existsSync(app.outputDir)) {
    fs.rmSync(app.outputDir, { recursive: true, force: true });
  }

  execSync("npm ci", {
    cwd: app.sourceDir,
    stdio: "inherit",
  });

  execSync("npm run build", {
    cwd: app.sourceDir,
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_BASE_PATH: app.basePath,
    },
  });

  fs.cpSync(path.join(app.sourceDir, "dist"), app.outputDir, {
    recursive: true,
  });

  // Ensure non-root SPA entry points route correctly on Vercel.
  const notFoundPath = path.join(app.outputDir, "404.html");
  fs.copyFileSync(path.join(app.outputDir, "index.html"), notFoundPath);
}
