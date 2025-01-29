import { SortType } from "./option";
import { IShow } from "./show";

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
    results: IShow[];
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

export interface CollectionResponseType extends PaginationResponseType {
    name: string;
    description: string;
}
