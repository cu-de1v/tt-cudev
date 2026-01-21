import express from "express";
import cors from "cors";
import https from "https";
import TikTokScraper from "tiktok-scraper";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "CU-Dev TikTok Backend running 🚀"
  });
});

app.get("/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const data = await TikTokScraper.getVideoMeta(url);
    const videoUrl = data.collector[0].videoUrl;

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
      streamUrl: `${baseUrl}/stream?video=${encodeURIComponent(videoUrl)}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch TikTok" });
  }
});

app.get("/stream", (req, res) => {
  const { video } = req.query;
  if (!video) return res.status(400).end();

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=tiktok.mp4"
  );
  res.setHeader("Content-Type", "video/mp4");

  https.get(video, vRes => vRes.pipe(res))
    .on("error", () => res.status(500).end());
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Backend running");
});
