export interface PagedResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
}
