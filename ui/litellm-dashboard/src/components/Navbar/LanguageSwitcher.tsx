"use client";

import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Compact EN / 中文 toggle used in the dashboard header and on the login page.
 */
export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const buttonClass = (active: boolean) =>
    `rounded-md px-2 py-1 text-xs font-medium transition-colors ${
      active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <div
      role="group"
      aria-label="切换语言 / Switch language"
      className="flex items-center gap-0.5 rounded-lg bg-gray-50 p-0.5"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={buttonClass(lang === "en")}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("zh")}
        aria-pressed={lang === "zh"}
        className={buttonClass(lang === "zh")}
      >
        中文
      </button>
    </div>
  );
}
