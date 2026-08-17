export interface CategoryColor {
  bg: string;
  text: string;
}

const CATEGORY_COLORS: Record<string, CategoryColor> = {
  "اجتماعی": { bg: "#dbeafe", text: "#1e40af" },
  "اقتصاد": { bg: "#d1fae5", text: "#065f46" },
  "سیاسی": { bg: "#fee2e2", text: "#991b1b" },
  "ورزشی": { bg: "#ffedd5", text: "#9a3412" },
  "فرهنگی و هنری": { bg: "#ede9fe", text: "#5b21b6" },
  "بین‌الملل": { bg: "#cffafe", text: "#155e75" },
  "حوادث": { bg: "#ffe4e6", text: "#9f1239" },
  "علمی و فناوری": { bg: "#e0e7ff", text: "#3730a3" },
  "جامعه": { bg: "#f1f5f9", text: "#334155" },
  "رسانه": { bg: "#fef3c7", text: "#92400e" }
};

const DEFAULT_COLOR: CategoryColor = { bg: "#f1f5f9", text: "#334155" };

export function getCategoryColor(category: string): CategoryColor {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
}
