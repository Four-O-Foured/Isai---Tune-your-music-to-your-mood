import express from "express";
import multer from "multer";
import { uploadAudio, uploadImage } from "../services/storage.services.js";
export const router = express.Router();
router.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

import { Song } from "../models/songs.model.js";

// Configure multer to handle both fields
const uploadFields = upload.fields([
  { name: "audio", maxCount: 1 },
  { name: "cover", maxCount: 1 },
]);

router.post("/songs", uploadFields, async (req, res) => {
  try { 
    const { title, artist, mood } = req.body;
    const audioFile = req.files.audio?.[0];
    const coverFile = req.files.cover?.[0];

    if (!audioFile || !coverFile) {
      return res.status(400).send("Please upload both audio and cover files");
    }

    // Upload both files concurrently
    const [audioResult, coverResult] = await Promise.all([
      uploadAudio(audioFile),
      uploadImage(coverFile),
    ]);

    const audioUrl = audioResult.url;
    const coverUrl = coverResult.url;

    // Create new song in database
    const song = await Song.create({
      title,
      artist,
      mood,
      audio: audioUrl,
      cover: coverUrl,
    });

    res.status(201).json(song);
  } catch (error) {
    console.error("Error creating song:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/songs", async (req, res) => {
  try {
    const expression = req.query.expression;
    const songs = await Song.find({ mood: expression });
    res.status(200).json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).send("Internal Server Error");
  }
});
