import { PaginationResponseType } from "../interfaces/api";
import { ShowType } from "../interfaces/show";

export interface PaginationOptions {
    page?: string | number;
    limit?: string | number;
}

export function getPaginationParams(options: PaginationOptions) {
    const pageNum =
        typeof options.page === "string" ? parseInt(options.page, 10) : options.page || 1;
    const limitNum =
        typeof options.limit === "string" ? parseInt(options.limit, 10) : options.limit || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;

    return {
        pageNum,
        limitNum,
        startIndex,
        endIndex,
    };
}

export function paginatedResult(
    array: ShowType[],
    options: PaginationOptions
): PaginationResponseType {
    const { pageNum, limitNum, startIndex, endIndex } = getPaginationParams(options);
    const paginatedItems = array.slice(startIndex, endIndex);

    return {
        results: paginatedItems,
        totalDocs: array.length,
        limit: limitNum,
        totalPages: Math.ceil(array.length / limitNum),
        page: pageNum,
        pagingCounter: startIndex + 1,
        hasPrevPage: pageNum > 1,
        hasNextPage: endIndex < array.length,
        prevPage: pageNum > 1 ? pageNum - 1 : null,
        nextPage: endIndex < array.length ? pageNum + 1 : null,
    };
}
