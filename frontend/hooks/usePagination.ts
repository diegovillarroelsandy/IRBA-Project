import { useState } from "react";

export function usePagination(initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const resetPage = () => setPage(1);

  const changePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  return {
    page,
    setPage,

    pageSize,
    setPageSize: changePageSize,

    total,
    setTotal,

    totalPages,
    setTotalPages,

    resetPage,
  };
}
