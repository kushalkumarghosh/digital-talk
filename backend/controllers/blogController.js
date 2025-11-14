import Blog from "../models/Blog.js";
import { validationResult } from "express-validator";

export const listPublic = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "10");
    const skip = (page - 1) * limit;

    const filter = {};
    const { category } = req.query;
    if (category && category !== "All") {
      filter.category = category;
    }

    const [items, total] = await Promise.all([
      Blog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ msg: "Failed to fetch blogs" });
  }
}

export const readById = async (req, res) => {
  try {
    const { id } = req.params;

    let blog = null;

    if (/^\d+$/.test(id)) {
      blog = await Blog.findOne({ numericId: Number(id) });
    }

    if (!blog) {
      blog = await Blog.findById(id);
    }

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    res.json({ blog });
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ msg: "Failed to fetch blog" });
  }
}

export const createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, image, content,excerpt, category } = req.body;

    const blog = new Blog({
      title,
      image,
      content,
      category,
      excerpt: excerpt || content.slice(0, 150) + "...",
    });

    await blog.save();
    res.status(201).json({ msg: "Blog created successfully", blog });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ msg: "Failed to create blog" });
  }
}

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    blog.title = req.body.title || blog.title;
    blog.image = req.body.image || blog.image;
    blog.content = req.body.content || blog.content;
    blog.category = req.body.category || blog.category;
    blog.excerpt =
      req.body.excerpt || blog.content.slice(0, 150) + "...";

    await blog.save();
    res.json({ msg: "Blog updated successfully", blog });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ msg: "Failed to update blog" });
  }
}

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.json({ msg: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ msg: "Failed to delete blog" });
  }
}


