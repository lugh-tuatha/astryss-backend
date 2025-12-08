export interface CursorPaginationMeta {
  limit: number;
  total: number;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CursorPaginationResponse<T> {
  data: T[];
  meta: CursorPaginationMeta
}
