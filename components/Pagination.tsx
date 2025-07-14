import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-text-secondary">
        Showing <span className="font-semibold text-text-primary">{startItem}</span> to <span className="font-semibold text-text-primary">{endItem}</span> of <span className="font-semibold text-text-primary">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm font-medium bg-slate-700 text-text-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm font-medium bg-slate-700 text-text-primary rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
