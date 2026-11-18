const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("./users");

const app = express();
const PORT = process.env.PORT || 3000;

// JWT secret (for this lab only)
const JWT_SECRET = "lab4_jwt_secret_key";

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Lab 4 Registration and Login API is running");
});

// Register API
app.post("/register", async (req, res) => {
    try {
        const { username, name, password } = req.body;

        if (!username || !name || !password) {
            return res.status(400).json({
                message: "Username, name and password are required"
            });
        }

        // Check if username already exists
        const existingUser = users.find(
            user => user.username === username
        );

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = {
            username,
            name,
            password: hashedPassword
        };

        users.push(newUser);

        return res.status(201).json({
            message: "Registration successful",
            user: {
                username: newUser.username,
                name: newUser.name
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // Find user
        const user = users.find(
            user => user.username === username
        );

        if (!user) {
            return res.status(400).json({
                message: "Invalid username"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Wrong password"
            });
        }

        // Create JWT
        const jwtToken = jwt.sign(
            { username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            jwt_token: jwtToken
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});