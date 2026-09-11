require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const path = require("node:path");

const { connectDB } = require("./config/db");
const { ensureAdminAccount } = require("./data/store");
const authRoutes = require("./routes/authRoutes");
const tourRoutes = require("./routes/tourRoutes");

const app = express();
const port = Number(process.env.PORT || 7000);

function resolveFirstExistingDir(...candidateDirs) {
  for (const candidate of candidateDirs) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return candidateDirs[0];
}

const projectRootCandidates = [
  path.resolve(__dirname, ".."),
  path.resolve(__dirname)
];

const frontendDir = resolveFirstExistingDir(
  ...projectRootCandidates.flatMap((root) => [path.join(root, "frontend"), root])
);
const assetsDir = resolveFirstExistingDir(
  ...projectRootCandidates.flatMap((root) => [
    path.join(root, "frontend", "assets"),
    path.join(root, "assets")
  ])
);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());
app.use("/assets", express.static(assetsDir));
app.use(express.static(frontendDir));

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "touredo-api" }));
app.use("/api/auth", authRoutes);
app.use("/api", tourRoutes);

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "Route not found." });
  }
  return res.sendFile(path.join(frontendDir, "index.html"));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error." });
});

async function start() {
  await connectDB();
  await ensureAdminAccount();

  app.listen(port, () => {
    console.log(`TourEdo API running at http://localhost:${port}`);
  });
}

start();
