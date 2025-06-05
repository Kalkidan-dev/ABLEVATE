import React, { useState, useEffect } from 'react';

function Pagination({ total, pageSize, currentPage, onPageChange, onPageSizeChange }) {
  const totalPages = Math.ceil(total / pageSize);
  const [inputPage, setInputPage] = useState(currentPage);
  const [inputPageSize, setInputPageSize] = useState(pageSize);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setInputPageSize(pageSize);
  }, [pageSize]);

  if (totalPages <= 1) return null;

  // Helper to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Handle input page jump (on Enter key or blur)
  const handlePageInput = e => {
    if (e.key === 'Enter' || e.type === 'blur') {
      let page = Number(inputPage);
      if (isNaN(page) || page < 1) page = 1;
      else if (page > totalPages) page = totalPages;
      if (page !== currentPage) {
        onPageChange(page);
      } else {
        setInputPage(currentPage); // reset input if invalid or same
      }
    }
  };

  // Handle page size change
  const handlePageSizeChange = e => {
    const size = Number(e.target.value);
    setInputPageSize(size);
    onPageSizeChange(size);
  };

  return (
    <nav aria-label="Pagination Navigation" className="mt-6 flex flex-col items-center space-y-3 md:flex-row md:justify-between md:space-y-0">
      {/* Left: Jump to First / Previous */}
      <ul className="inline-flex items-center space-x-1">
        <li>
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            aria-label="Jump to First Page"
          >
            &#171; First
          </button>
        </li>
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            aria-label="Previous Page"
          >
            &laquo; Prev
          </button>
        </li>
      </ul>

      {/* Center: Page numbers with ellipsis */}
      <ul className="inline-flex items-center space-x-1">
        {/* First page + ellipsis */}
        {pageNumbers[0] > 1 && (
          <>
            <li>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100"
                aria-label="Page 1"
                aria-current={currentPage === 1 ? 'page' : undefined}
              >
                1
              </button>
            </li>
            {pageNumbers[0] > 2 && (
              <li className="px-2 py-1 select-none text-gray-500">…</li>
            )}
          </>
        )}

        {/* Page numbers */}
        {pageNumbers.map(page => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded border ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white border-gray-300 hover:bg-gray-100'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Last page + ellipsis */}
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <li className="px-2 py-1 select-none text-gray-500">…</li>
            )}
            <li>
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-1 rounded bg-white border border-gray-300 hover:bg-gray-100"
                aria-label={`Page ${totalPages}`}
                aria-current={currentPage === totalPages ? 'page' : undefined}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
      </ul>

      {/* Right: Next / Last buttons */}
      <ul className="inline-flex items-center space-x-1">
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            aria-label="Next Page"
          >
            Next &raquo;
          </button>
        </li>
        <li>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            aria-label="Jump to Last Page"
          >
            Last &#187;
          </button>
        </li>
      </ul>

      {/* Below: Page jump input and page size selector */}
      <div className="mt-2 flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
        <label htmlFor="jump-page" className="text-sm">
          Jump to page:
          <input
            type="number"
            id="jump-page"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={e => setInputPage(e.target.value)}
            onKeyDown={handlePageInput}
            onBlur={handlePageInput}
            className="ml-2 w-16 p-1 border border-gray-300 rounded text-center"
            aria-label="Page number input"
          />
        </label>

        <label htmlFor="page-size" className="text-sm">
          Items per page:
          <select
            id="page-size"
            value={inputPageSize}
            onChange={handlePageSizeChange}
            className="ml-2 p-1 border border-gray-300 rounded"
            aria-label="Select items per page"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    </nav>
  );
}

export default Pagination;
