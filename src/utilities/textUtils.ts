/** lowercase + trim */
export function norm(input: string): string {
    return (input || "").toLowerCase().trim();
}

/** lowercase + rm punctuation + spaces */
export function textNormalizeForMatch(text: string): string {
    return norm(text.replace(/[^\w\s-]/g, " ").replace(/\s+/g, " "));
}
