"use client";

import React from "react";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import { StyleProvider } from "@ant-design/cssinjs";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AntdGlobalProvider({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage();
  const antdLocale = lang === "zh" ? zhCN : enUS;

  return (
    <StyleProvider layer>
      <ConfigProvider theme={{ cssVar: true }} locale={antdLocale}>
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
