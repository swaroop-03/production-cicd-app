const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || "1.0.0";

app.get("/", (req, res) => {
    res.json({
        application: "Production CI/CD GitOps Platform",
        version: VERSION,
        message: "Application is running"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        version: VERSION
    });
});

app.get("/version", (req, res) => {
    res.json({
        version: VERSION
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Application running on port ${PORT}`);
});
