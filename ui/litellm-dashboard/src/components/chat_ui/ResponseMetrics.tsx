import React from "react";
import { Tooltip } from "antd";
import {
  ClockCircleOutlined,
  NumberOutlined,
  ImportOutlined,
  ExportOutlined,
  BulbOutlined,
  ToolOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { t } from "@/contexts/LanguageContext";

export interface TokenUsage {
  completionTokens?: number;
  promptTokens?: number;
  totalTokens?: number;
  reasoningTokens?: number;
  cost?: number;
}

interface ResponseMetricsProps {
  timeToFirstToken?: number;
  totalLatency?: number;
  usage?: TokenUsage;
  toolName?: string;
}

const ResponseMetrics: React.FC<ResponseMetricsProps> = ({ timeToFirstToken, totalLatency, usage, toolName }) => {
  if (!timeToFirstToken && !totalLatency && !usage) return null;

  return (
    <div className="response-metrics mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 flex flex-wrap gap-3">
      {timeToFirstToken !== undefined && (
        <Tooltip title={t("Time to first token")}>
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            <span>TTFT: {(timeToFirstToken / 1000).toFixed(2)}s</span>
          </div>
        </Tooltip>
      )}

      {totalLatency !== undefined && (
        <Tooltip title={t("Total latency")}>
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            <span>{t("Total Latency: {0}s", (totalLatency / 1000).toFixed(2))}</span>
          </div>
        </Tooltip>
      )}

      {usage?.promptTokens !== undefined && (
        <Tooltip title={t("Prompt tokens")}>
          <div className="flex items-center">
            <ImportOutlined className="mr-1" />
            <span>{t("In: {0}", usage.promptTokens)}</span>
          </div>
        </Tooltip>
      )}

      {usage?.completionTokens !== undefined && (
        <Tooltip title={t("Completion tokens")}>
          <div className="flex items-center">
            <ExportOutlined className="mr-1" />
            <span>{t("Out: {0}", usage.completionTokens)}</span>
          </div>
        </Tooltip>
      )}

      {usage?.reasoningTokens !== undefined && (
        <Tooltip title={t("Reasoning tokens")}>
          <div className="flex items-center">
            <BulbOutlined className="mr-1" />
            <span>{t("Reasoning: {0}", usage.reasoningTokens)}</span>
          </div>
        </Tooltip>
      )}

      {usage?.totalTokens !== undefined && (
        <Tooltip title={t("Total tokens")}>
          <div className="flex items-center">
            <NumberOutlined className="mr-1" />
            <span>{t("Total: {0}", usage.totalTokens)}</span>
          </div>
        </Tooltip>
      )}

      {usage?.cost !== undefined && (
        <Tooltip title={t("Cost")}>
          <div className="flex items-center">
            <DollarOutlined className="mr-1" />
            <span>${usage.cost.toFixed(6)}</span>
          </div>
        </Tooltip>
      )}

      {toolName && (
        <Tooltip title={t("Tool used")}>
          <div className="flex items-center">
            <ToolOutlined className="mr-1" />
            <span>{t("Tool: {0}", toolName)}</span>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default ResponseMetrics;
