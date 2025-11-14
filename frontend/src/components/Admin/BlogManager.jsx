import { useEffect, useState } from "react";
import api from "../../api/axios";

const CATEGORY_OPTIONS = ["Startups", "Security", "AI", "Apps", "Tech"];

function getImagePreviewUrl(image) {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const backendBase = apiBase.replace(/\/api\/?$/, "");
  const normalizedPath = image.replace(/^\/+/, "");

  return `${backendBase}/${normalizedPath}`;
}

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    image: "",
    category: "",
    content: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function load() {
    const { data } = await api.get("/blogs");
    setBlogs(data.items || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/blogs/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm((prev) => ({
        ...prev,
        image: data.imagePath,
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      const msg =
        err?.response?.data?.msg || err?.message || "Image upload failed";
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  }

  async function save(e) {
    e.preventDefault();

    if (editingId) {
      await api.put(`/blogs/${editingId}`, form);
    } else {
      await api.post("/blogs", form);
    }

    setForm({ title: "", image: "", category: "", content: "" });
    setEditingId(null);
    load();
  }

  async function del(id) {
    await api.delete(`/blogs/${id}`);
    load();
  }

  function edit(blog) {
    setForm({
      title: blog.title || "",
      image: blog.image || "",
      category: blog.category || "",
      content: blog.content || "",
    });
    setEditingId(blog._id);
  }

  const previewUrl = getImagePreviewUrl(form.image);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Manage Blogs</h2>

      <form onSubmit={save} className="grid gap-3 mb-6 max-w-lg">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 rounded"
          />
          {uploading && (
            <p className="text-xs text-gray-500">Uploading image…</p>
          )}
          {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 h-32 w-full object-cover rounded border"
            />
          )}
          {form.image && !previewUrl && (
            <p className="text-xs text-gray-500 break-all">
              Stored image path: {form.image}
            </p>
          )}
        </div>

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select category</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={6}
          className="border p-2 rounded"
        />

        <button className="bg-black text-white rounded py-2">
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      <ul>
        {blogs.map((b) => (
          <li
            key={b._id}
            className="border p-3 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-gray-500">
                {b.category || "Uncategorized"}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => edit(b)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => del(b._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
