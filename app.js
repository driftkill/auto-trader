const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.mongourl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Define Schema and Model
const dataSchema = new mongoose.Schema(
    {
        text: String,
    },
    { timestamps: true }
);

const Data = mongoose.model("Data", dataSchema);

// Health Check API
app.get("/health", (req, res) => {
    res.status(200).send("Server is healthy");
});

// Post Data API
app.post("/data", async (req, res) => {
    try {
        const newData = new Data({ text: req.body.text });
        await newData.save();
        res.status(201).send(newData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get Data API
app.get("/data", async (req, res) => {
    try {
        const data = await Data.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start the server
app.listen(process.env.port, () => {
    console.log(`Server is running on http://localhost:${process.env.port}`);
});
