import { useNavigate } from "react-router-dom";

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

export default function BlogCards({ blogs = [] }) {
  const navigate = useNavigate();

  const handleClick = (blog) => {
    const id = blog.id || blog.numericId || blog._id;
    if (!id) return;
    navigate(`/blogs/${id}`);
  };

  const getExcerpt = (blog) => {
    if (blog.excerpt) return blog.excerpt;
    if (!blog.content) return "";
    const text = blog.content.replace(/<[^>]+>/g, "");
    return text.length > 140 ? `${text.slice(0, 140)}…` : text;
  };

  if (!blogs.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No blogs found for this category.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => {
        const imageUrl = getImageUrl(blog.image);

        return (
          <div
            key={blog.id || blog._id}
            onClick={() => handleClick(blog)}
            className="cursor-pointer group bg-white rounded-xl shadow-sm hover:shadow-md transition h-full flex flex-col overflow-hidden"
          >
            {imageUrl && (
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="flex flex-col flex-1 p-4">
              {blog.category && (
                <span className="inline-block text-[11px] uppercase tracking-wide font-semibold text-indigo-600 mb-1">
                  {blog.category}
                </span>
              )}

              <h3 className="text-base md:text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                {blog.title}
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {getExcerpt(blog)}
              </p>

              <div className="mt-auto pt-2 border-t flex items-center justify-between text-[11px] text-gray-500">
                <span>{blog.author || "Admin"}</span>
                <span>
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
