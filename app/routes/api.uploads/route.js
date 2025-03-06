import express from "express";
import upload from "../upload";

// import upload from "./upload.js"; 

const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path, 
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
