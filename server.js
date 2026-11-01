const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.status(200).send("Welcome to Node.js and Express Server!");
});

app.get("/about", (req, res) => {
    res.status(200).json({
        name: "Gandla Bala Abhishikth",
        section: "AIML-2B"
    });
});

app.get("/time", (req, res) => {
    res.status(200).json({
        currentDateTime: new Date().toISOString()
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: "404 - Page Not Found",
        path: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});