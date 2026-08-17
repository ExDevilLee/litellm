"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

/**
 * Lightweight UI language layer for the LiteLLM Admin UI.
 *
 * Design notes:
 * - `t()` is a plain module-level function (not a hook) so it can be used from
 *   module-level helpers such as nav config renderers. It reads a module-level
 *   `currentLang` that the provider keeps in sync, so translations apply on the
 *   next render after a language switch.
 * - The dictionary is keyed by the English source string; anything missing
 *   falls back to English, so partial translations never break the UI.
 * - The initial client render stays "en" to match the statically exported HTML
 *   (avoids hydration mismatches); the stored preference is applied in an
 *   effect right after mount.
 */

export type UiLang = "en" | "zh";

const STORAGE_KEY = "litellm_ui_lang";

/** English source string -> Simplified Chinese. */
const zhDict: Record<string, string> = {
  // ---- Sidebar groups ----
  "AI GATEWAY": "AI 网关",
  OBSERVABILITY: "可观测性",
  "ACCESS CONTROL": "访问控制",
  "DEVELOPER TOOLS": "开发者工具",
  SETTINGS: "设置",
  // SECTION_DISPLAY variants (breadcrumb)
  "AI Gateway": "AI 网关",
  Observability: "可观测性",
  "Access Control": "访问控制",
  "Developer Tools": "开发者工具",

  // ---- Sidebar items ----
  "Virtual Keys": "虚拟密钥",
  Playground: "演练场",
  "Models + Endpoints": "模型 + 端点",
  Agentic: "智能体",
  Agents: "智能体",
  "Workflow Runs": "工作流运行",
  Memory: "记忆",
  "MCP Servers": "MCP 服务器",
  Skills: "技能",
  Guardrails: "防护栏",
  Policies: "策略",
  Tools: "工具",
  "Search Tools": "搜索工具",
  "Vector Stores": "向量存储",
  "Tool Policies": "工具策略",
  Usage: "用量",
  "Cost Optimization": "成本优化",
  Logs: "日志",
  "Guardrails Monitor": "防护栏监控",
  Teams: "团队",
  Projects: "项目",
  "Internal Users": "内部用户",
  Organizations: "组织",
  "Access Groups": "访问组",
  Budgets: "预算",
  "API Reference": "API 参考",
  "AI Hub": "AI 中心",
  "Learning Resources": "学习资源",
  "Response Cache": "响应缓存",
  Experimental: "实验功能",
  Prompts: "提示词",
  "API Playground": "API 演练场",
  "Tag Management": "标签管理",
  "Old Usage": "旧版用量",
  Settings: "设置",
  "Router Settings": "路由设置",
  "Logging & Alerts": "日志与告警",
  "Admin Settings": "管理员设置",
  "Cost Tracking": "成本追踪",
  "UI Theme": "界面主题",

  // ---- Navbar / sidebar chrome ----
  "Expand sidebar": "展开侧边栏",
  "Collapse sidebar": "收起侧边栏",
  Docs: "文档",
  "Thanks for using LiteLLM!": "感谢使用 LiteLLM！",

  // ---- Login page ----
  Login: "登录",
  "Access your LiteLLM Admin UI.": "访问你的 LiteLLM 管理界面。",
  "Default Credentials": "默认凭据",
  "By default, Username is": "默认情况下，用户名为",
  "and Password is your set LiteLLM Proxy": "，密码是你设置的 LiteLLM Proxy",
  "Need to set UI credentials or SSO?": "需要配置登录凭据或 SSO？",
  "Check the documentation": "查看文档",
  Username: "用户名",
  Password: "密码",
  "Please enter your username": "请输入用户名",
  "Please enter your password": "请输入密码",
  "Enter your username": "输入用户名",
  "Enter your password": "输入密码",
  "Logging in...": "登录中...",
  "Login with SSO": "使用 SSO 登录",
  "Please configure SSO to log in with SSO.": "请先配置 SSO，才能使用 SSO 登录。",
  Worker: "Worker",
  "Choose a worker to connect to": "选择要连接的 Worker",
  "Admin UI Disabled": "管理界面已禁用",
  "The Admin UI has been disabled by the administrator. To re-enable it, please update the following environment variable:":
    "管理界面已被管理员禁用。要重新启用，请更新以下环境变量：",
  "Single Sign-On (SSO) is enabled. LiteLLM no longer automatically redirects to the SSO login flow upon loading this page. To re-enable auto-redirect-to-SSO, set":
    "已启用单点登录（SSO）。LiteLLM 不再在加载此页面时自动跳转到 SSO 登录流程。要重新启用自动跳转 SSO，请设置",
  "in your environment configuration.": "环境变量。",
};

let currentLang: UiLang = "en";

/** Translate an English source string; falls back to the input itself. */
export function t(text: string): string {
  if (currentLang !== "zh") return text;
  return zhDict[text] ?? text;
}

interface LanguageContextType {
  lang: UiLang;
  setLang: (lang: UiLang) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Graceful variant used by chrome components that may also render on pages
 * mounted outside the provider (e.g. tests): falls back to English instead of
 * throwing.
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context) return context;
  return {
    lang: "en",
    setLang: () => {
      // No provider mounted: ignore (static export always mounts one).
    },
  };
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<UiLang>("en");

  const applyLang = (next: UiLang) => {
    currentLang = next;
    if (typeof document !== "undefined") {
      document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    }
  };

  // Apply the stored preference after mount (keeps first render == exported HTML).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "zh" || stored === "en") {
        applyLang(stored);
        setLangState(stored);
      }
    } catch {
      // localStorage unavailable (private mode etc.) — stay on English.
    }
  }, []);

  const setLang = (next: UiLang) => {
    applyLang(next);
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures; switch still applies for this session.
    }
  };

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
};
