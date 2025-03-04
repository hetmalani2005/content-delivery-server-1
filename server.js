const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

// Middleware to log user visits
app.use((req, res, next) => {
    const logEntry = `${new Date().toISOString()} - IP: ${req.ip}\n`;
    fs.appendFileSync("visits.log", logEntry);
    console.log(logEntry.trim());
    next();
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// API to retrieve log data
app.get("/logs", (req, res) => {
    fs.readFile("visits.log", "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Could not read log file" });
        const logs = data.split("\n").filter(line => line).map(line => {
            const [timestamp, ip] = line.split(" - IP: ");
            return { timestamp, ip };
        });
        res.json(logs);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
