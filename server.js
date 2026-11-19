const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Render port or local port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(path.join(__dirname, "../public")));

// Messages file path
const messagesFile = path.join(__dirname, "messages.json");

// Create messages file if not exists
if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, "[]");
}

// Contact API
app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        date: new Date().toISOString()
    };

    try {
        const existingMessages = JSON.parse(
            fs.readFileSync(messagesFile, "utf8")
        );

        existingMessages.push(newMessage);

        fs.writeFileSync(
            messagesFile,
            JSON.stringify(existingMessages, null, 2)
        );

        return res.status(201).json({
            message: "Message saved successfully!"
        });

    } catch (error) {
        console.error("Error saving message:", error);

        return res.status(500).json({
            message: "Unable to save message."
        });
    }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
