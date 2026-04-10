const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const backendRoot = path.resolve(__dirname, "..");
const npmExecPath = process.env.npm_execpath;
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

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

function runNpm(args, options) {
  const attempts = [];

  if (npmExecPath) {
    attempts.push({ command: process.execPath, commandArgs: [npmExecPath, ...args] });
  }

  attempts.push({ command: npmCommand, commandArgs: args });

  let lastError = null;

  for (const attempt of attempts) {
    const result = spawnSync(attempt.command, attempt.commandArgs, {
      stdio: "inherit",
      shell: false,
      ...options,
    });

    if (!result.error && result.status === 0) {
      return;
    }

    lastError = result.error || new Error(`exit code ${result.status}`);
  }

  throw new Error(`npm ${args.join(" ")} failed: ${lastError ? lastError.message : "unknown error"}`);
}

for (const app of apps) {
  if (fs.existsSync(app.outputDir)) {
    fs.rmSync(app.outputDir, { recursive: true, force: true });
  }

  runNpm(["ci"], {
    cwd: app.sourceDir,
  });

  runNpm(["run", "build"], {
    cwd: app.sourceDir,
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
