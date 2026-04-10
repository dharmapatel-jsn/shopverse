const { spawnSync } = require("child_process");
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

function runViteBuild(app) {
  const viteBin = path.join(app.sourceDir, "node_modules", "vite", "bin", "vite.js");

  if (!fs.existsSync(viteBin)) {
    throw new Error(`Missing Vite binary for ${app.name}. Ensure dependencies are installed before build.`);
  }

  const result = spawnSync(process.execPath, [viteBin, "build"], {
    cwd: app.sourceDir,
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      VITE_BASE_PATH: app.basePath,
    },
  });

  if (result.status !== 0) {
    throw new Error(`${app.name} build failed with exit code ${result.status}`);
  }
}

for (const app of apps) {
  if (fs.existsSync(app.outputDir)) {
    fs.rmSync(app.outputDir, { recursive: true, force: true });
  }

  runViteBuild(app);

  fs.cpSync(path.join(app.sourceDir, "dist"), app.outputDir, {
    recursive: true,
  });

  // Ensure non-root SPA entry points route correctly on Vercel.
  const notFoundPath = path.join(app.outputDir, "404.html");
  fs.copyFileSync(path.join(app.outputDir, "index.html"), notFoundPath);
}
