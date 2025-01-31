export const formatUrl = (input: string): string => {
    return input
        .toLowerCase() // Convert to lowercase
        .trim() // Remove leading and trailing whitespace
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/[^\w-]+/g, "") // Remove non-word characters (except hyphens)
        .replace(/--+/g, "-"); // Replace multiple hyphens with single hyphen
};
