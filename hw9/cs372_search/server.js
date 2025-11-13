// server.js — HW9: CS372 Search with Mongoose
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3720;

// --- MongoDB connection ---
mongoose.connect(process.env.MONGODB_URI, {
  dbName: "search",
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  family: 4
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// --- Schema ---
const searchSchema = new mongoose.Schema({ text: String });
const Search = mongoose.model("Search", searchSchema);

// --- Middleware ---
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// --- Routes ---

// Add string (“I'm feeling lucky!”)
app.post("/add", async (req, res) => {
  const searchTerm = req.body.searchTerm; // <-- MATCH YOUR FRONTEND

  if (!searchTerm) return res.status(400).json({ error: "Empty text" });

  try {
    await new Search({ text: searchTerm }).save();
    res.json({ ok: true, message: "Saved!" });
  } catch (err) {
    console.error("Error saving text:", err);
    res.status(500).json({ error: "Database save failed" });
  }
});

// Search strings (“CS372 Search”)
app.get("/search", async (req, res) => {
  const q = req.query.q || "";
  const regex = new RegExp(q, "i"); // case-insensitive

  try {
    const results = await Search.find({ text: { $regex: regex } })
      .select("text -_id");  // <-- IMPORTANT: only return { text: "..."} (NO extra fields)

    res.json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database search failed" });
  }
});


// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
