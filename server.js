import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: "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", // Replace with your actual OpenAI key
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
