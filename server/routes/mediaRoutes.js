import express from "express";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);
    console.log("CLOUDINARY RESULT:", result);
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        duration: result.duration,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        createdAt: result.created_at,
        playbackUrl: result.playback_url,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error uploading file",
    });
  }
});

export default router;
