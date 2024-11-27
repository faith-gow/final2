import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
import { AIopen } from './Secrets.js';

const app = express();
const PORT = 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: AIopen.key,
});

// Middleware
app.use(cors()); // Allow all origins
app.use(bodyParser.json());

// Root route for server status
app.get("/", (req, res) => {
  res.send("Server is running. Use the /generate-image endpoint for image generation.");
});

// Endpoint to generate an image
app.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    res.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
