import React from "react";
import { Form, Input } from "antd";
import { AGENT_FORM_CONFIG } from "./agent_config";
import { t } from "@/contexts/LanguageContext";

const CostConfigFields: React.FC = () => {
  return (
    <>
      {AGENT_FORM_CONFIG.cost.fields.map((field) => (
        <Form.Item
          key={field.name}
          label={t(field.label)}
          name={field.name}
          tooltip={field.tooltip ? t(field.tooltip) : undefined}
        >
          <Input placeholder={field.placeholder ? t(field.placeholder) : undefined} type="number" step="0.000001" />
        </Form.Item>
      ))}
    </>
  );
};

export default CostConfigFields;
