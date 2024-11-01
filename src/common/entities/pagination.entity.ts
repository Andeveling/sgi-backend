import { IPagination } from 'src/interfaces/pagination.interface';

export class Pagination {
  private totalItems: number;
  private totalPages: number;
  private currentPage: number;
  private limit: number = 5;
  private offset: number = 0;

  constructor({ limit, offset, totalItems }) {
    this.limit = limit;
    this.offset = offset;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.limit);
    this.currentPage = Math.floor(this.offset / this.limit) + 1;
  }

  public getPaginationInfo(): IPagination {
    return {
      total_items: this.totalItems,
      current_page: this.currentPage,
      total_pages: this.totalPages,
      limit: this.limit,
      offset: this.offset,
    };
  }
}
