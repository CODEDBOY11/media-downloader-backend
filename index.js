import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 5000;
const TMDB_API_KEY = "04553a35f2a43bffba8c0dedd36ac92b";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Middleware
app.use(cors());
app.use(express.json());

// Search endpoint
app.get("/api/search", async (req, res) => {
  const { q: query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
      },
    });

    const results = response.data.results.map((item) => ({
      id: item.id,
      title: item.title || item.name,
      description: item.overview,
      image: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : "/placeholder.png",
    }));

    res.json({ results });
  } catch (error) {
    console.error("Error fetching data from TMDB:", error);
    res.status(500).json({ error: "Failed to fetch data from TMDB" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
