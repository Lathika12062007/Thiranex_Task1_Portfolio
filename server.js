
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

app.use(express.static(
    path.join(__dirname, "../public")
));

// Messages file
const messagesFile = path.join(
    __dirname,
    "messages.json"
);

// Create messages file if it does not exist
if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, "[]");
}

// Contact API
app.post("/api/contact", (req, res) => {

    const { name, email, subject, message } = req.body;

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

        res.status(201).json({
            message: "Message saved successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to save message."
        });

    }

});

// Start server
app.listen(PORT, () => {

    console.log(
        `Portfolio server running at http://localhost:${PORT}`
    );

});
