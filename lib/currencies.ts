export const Currencies = [
  { value: "INR", label: "₹ Indian rupee", locale: "hi-IN" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "CNY", label: "¥ Chinese yuan", locale: "zh-CN" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
];

export type Currency = {
  value: string;
  label: string;
  locale: string;
};
