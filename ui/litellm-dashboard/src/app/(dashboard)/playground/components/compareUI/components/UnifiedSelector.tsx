/**
 * Unified selector component that handles both model and agent selection
 * based on the current endpoint configuration.
 */

import { Select, Spin } from "antd";
import { t } from "@/contexts/LanguageContext";
import { SelectorOption, EndpointConfig } from "../endpoint_config";

interface UnifiedSelectorProps {
  value: string;
  options: SelectorOption[];
  loading: boolean;
  config: EndpointConfig;
  onChange: (value: string) => void;
}

export function UnifiedSelector({ value, options, loading, config, onChange }: UnifiedSelectorProps) {
  return (
    <Select
      value={value || undefined}
      placeholder={
        loading
          ? config.selectorType === "agent"
            ? t("Loading agents...")
            : t("Loading models...")
          : t(config.selectorPlaceholder)
      }
      onChange={onChange}
      loading={loading}
      showSearch
      filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
      options={options}
      className="w-48 md:w-64 lg:w-72"
      notFoundContent={
        loading ? (
          <div className="flex items-center justify-center py-2">
            <Spin size="small" />
          </div>
        ) : config.selectorType === "agent" ? (
          t("No agents available")
        ) : (
          t("No models available")
        )
      }
    />
  );
}
