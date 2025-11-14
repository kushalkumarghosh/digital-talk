import express from "express";
import {
  listPublic,
  readById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", listPublic);
router.get("/id/:id", readById);

router.post(
  "/upload-image",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ msg: "No image file uploaded" });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    return res.status(201).json({
      msg: "Image uploaded successfully",
      imagePath,
    });
  }
);

router.post("/", requireAuth, requireAdmin, createBlog);
router.put("/:id", requireAuth, requireAdmin, updateBlog);
router.delete("/:id", requireAuth, requireAdmin, deleteBlog);

export default router;
