"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Typography } from "antd";
import type { MemoryRow } from "@/components/networking";
import { t } from "@/contexts/LanguageContext";

const { Text } = Typography;

interface MemoryEditModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialRow?: MemoryRow;
  onClose: () => void;
  onSave: (key: string, value: string, metadataText: string, isCreate: boolean) => Promise<boolean>;
}

export const MemoryEditModal: React.FC<MemoryEditModalProps> = ({ open, mode, initialRow, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialRow) {
      form.setFieldsValue({
        key: initialRow.key,
        value: initialRow.value,
        metadata: initialRow.metadata != null ? JSON.stringify(initialRow.metadata, null, 2) : "",
      });
    } else {
      form.resetFields();
    }
  }, [open, mode, initialRow, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    const ok = await onSave(values.key.trim(), values.value ?? "", values.metadata ?? "", mode === "create");
    setSubmitting(false);
    if (ok) {
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? t("Create memory") : t("Edit {0}", initialRow?.key ?? "")}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      okText={mode === "create" ? t("Create") : t("Save")}
      confirmLoading={submitting}
      width={640}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={t("Key")}
          name="key"
          rules={[{ required: true, message: t("Key is required") }]}
          tooltip={t(
            "Globally unique — two memories cannot share a key. Namespace your own keys if you need per-user isolation (e.g. user:123:notes).",
          )}
        >
          <Input placeholder={t("e.g. user_role")} disabled={mode === "edit"} />
        </Form.Item>
        <Form.Item
          label={t("Value")}
          name="value"
          rules={[{ required: true, message: t("Value is required") }]}
          tooltip={t("Markdown/text injected into LLM context. Plain strings are fine.")}
        >
          <Input.TextArea rows={8} placeholder={t("What the agent should remember…")} />
        </Form.Item>
        <Form.Item
          label={
            <span>
              {t("Metadata")} <Text type="secondary">{t("(optional JSON)")}</Text>
            </span>
          }
          name="metadata"
          tooltip={t("Optional structured metadata — must be valid JSON if provided.")}
        >
          <Input.TextArea
            rows={4}
            placeholder='{"tags": ["example"]}'
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemoryEditModal;
