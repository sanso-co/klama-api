import { SortType } from "./option";
import { ShowType } from "./show";

export interface RequestQuery {
    page?: string;
    limit?: string;
    sort?: SortType;
    keyword?: string;
    genre?: string;
    tone?: string;
    from?: string;
    to?: string;
    query?: string;
}

export interface PaginationResponseType {
    results: ShowType[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}
