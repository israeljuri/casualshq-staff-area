import { useState, useMemo } from 'react';

type UsePaginationResult<T> = {
  paginatedData: T[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export function usePagination<T>(
  data: T[],
  pageSize: number
): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalCount = data.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  return {
    paginatedData,
    totalPages,
    totalCount,
    currentPage,
    setCurrentPage,
  };
}
