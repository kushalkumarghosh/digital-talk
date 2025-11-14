import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const backendBase = apiBase.replace(/\/api\/?$/, "");
  const normalizedPath = image.replace(/^\/+/, "");

  return `${backendBase}/${normalizedPath}`;
}

export default function SingleBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setError("");
        const { data } = await api.get(`/blogs/id/${id}`);
        setBlog(data.blog);
      } catch (err) {
        console.error("Error loading blog:", err);
        setError("Unable to load this blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading blog...</div>
    );
  }

  if (!blog) {
    return (
      <div className="py-20 text-center text-gray-500">Blog not found.</div>
    );
  }

  const imageUrl = getImageUrl(blog.image);
  const readingTime = blog.readingTime || blog.reading_time;

  return (
    <div className="bg-zinc-50 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-zinc-500 hover:text-zinc-900 mb-6 mt-4"
        >
          Back
        </button>

        <article className="bg-white rounded-2xl shadow-md overflow-hidden">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-80 object-cover"
            />
          )}

          <div className="p-6 md:p-10">
            {blog.category && (
              <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-700 rounded-full mb-4">
                {blog.category}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-zinc-500 mb-8">
              <span>By {blog.author || "Admin"}</span>

              {blog.createdAt && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </>
              )}

              {readingTime && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-300" />
                  <span>{readingTime}</span>
                </>
              )}
            </div>

            <div
              className="text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
