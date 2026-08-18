"use client";

import React from "react";
import Link from "next/link";
import { Alert } from "antd";
import { t } from "@/contexts/LanguageContext";

const DEPRECATION_DISCUSSION_URL = "https://github.com/BerriAI/litellm/discussions/32090";
const DEPRECATION_TARGET_DATE = "September 1, 2026";

interface DeprecationBannerProps {
  featureName: string;
}

export const DeprecationBanner: React.FC<DeprecationBannerProps> = ({ featureName }) => (
  <Alert
    message={t("{0} is on a draft deprecation list", featureName)}
    description={
      <>
        {t(
          "{0} is one of several experimental features we're considering removing, potentially as early as {1}. This list is a draft and is not final. If you rely on this feature, please share feedback on the ",
          featureName,
          DEPRECATION_TARGET_DATE,
        )}
        <Link href={DEPRECATION_DISCUSSION_URL} target="_blank" rel="noopener noreferrer">
          {t("deprecation discussion")}
        </Link>
        .
      </>
    }
    type="info"
    showIcon
    closable
    style={{ marginBottom: 16 }}
  />
);
