export default function Pagination({ onPageChange, currentPage, totalPages }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <ul className="my-8 flex flex-wrap items-center justify-center gap-3">
      <li>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
      </li>

      {pages.map((page) => (
        <li key={page}>
          <button
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-md border text-sm transition
              ${
                page === currentPage
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 hover:bg-indigo-50"
              }`}
          >
            {page}
          </button>
        </li>
      ))}

      <li>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </li>
    </ul>
  );
}
