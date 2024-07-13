export class PaginatedList<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;

  constructor(items: T[], totalItems: number, currentPage: number, limit: number) {
    this.items = items;
    this.totalItems = totalItems;
    this.limit = limit;
    this.currentPage = currentPage;
    this.totalPages = Math.ceil(totalItems / limit);
  }
}
