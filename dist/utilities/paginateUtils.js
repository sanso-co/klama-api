"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationParams = getPaginationParams;
exports.paginatedResult = paginatedResult;
function getPaginationParams(options) {
    const pageNum = typeof options.page === "string" ? parseInt(options.page, 10) : options.page || 1;
    const limitNum = typeof options.limit === "string" ? parseInt(options.limit, 10) : options.limit || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    return {
        pageNum,
        limitNum,
        startIndex,
        endIndex,
    };
}
function paginatedResult(array, options) {
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
