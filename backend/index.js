import express from "express";
import cors from "cors";
import { exec } from "child_process";
import https from "https";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "CU-Dev TikTok Backend (yt-dlp proxy) 🚀"
  });
});

/**
 * Download TikTok via PROXY STREAM (NO REDIRECT)
 */
app.get("/download", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("URL required");

  // yt-dlp: get video URL + headers as JSON
  const cmd = `yt-dlp -f "bv*+ba/b" --dump-json "${url}"`;

  exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout) => {
    if (err || !stdout) {
      console.error("yt-dlp error:", err);
      return res.status(500).send("Failed to extract TikTok video");
    }

    const info = JSON.parse(stdout);

    const videoUrl = info.url;
    const headers = info.http_headers || {};

    // Set download headers for browser
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tiktok.mp4"
    );
    res.setHeader("Content-Type", "video/mp4");

    // 🔥 PROXY request WITH headers
    const request = https.get(videoUrl, { headers }, videoRes => {
      videoRes.pipe(res);
    });

    request.on("error", err => {
      console.error("Stream error:", err);
      res.status(500).end("Stream error");
    });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
