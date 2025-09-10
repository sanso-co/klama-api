export const feelingSlugMap: Record<string, string> = {
    "feeling-down": "Feeling Down",
    "tired-drained": "Tired & Drained",
    "feeling-love": "Feeling Love",
    emotionless: "Emotionless",
    "stressed-out": "Stressed Out",
    "need-pick-me-up": "Need a Pick-Me-Up",
};

export const removeEmojis = (str: string): string => {
    return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F9FF}]/gu, "");
};

export const cleanText = (text: string): string => {
    return removeEmojis(text).replace(/\s+/g, " ").trim();
};
