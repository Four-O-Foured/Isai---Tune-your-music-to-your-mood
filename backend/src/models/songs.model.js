import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: String,
  audio: String,
  mood: String,
  cover: String,
  artist: String,
});

export const Song = mongoose.model("Song", songSchema);
