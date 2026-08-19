import React from "react";
import { t } from "@/contexts/LanguageContext";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { Organization } from "../networking";

interface OrganizationDropdownProps {
  organizations?: Organization[] | null;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  placeholder?: string;
  id?: string;
}

const OrganizationDropdown: React.FC<OrganizationDropdownProps> = ({
  organizations,
  value,
  onChange,
  disabled,
  loading,
  style,
  placeholder,
  id,
}) => {
  const resolvedPlaceholder = placeholder ?? t("All Organizations");
  return (
    <div style={{ minWidth: 280, ...style }}>
      <SearchSelect
        options={(organizations ?? []).map((org) => ({
          label: org.organization_alias || org.organization_id,
          value: org.organization_id,
          sublabel: org.organization_id,
        }))}
        value={value}
        onValueChange={(organizationId) => onChange?.(organizationId)}
        placeholder={resolvedPlaceholder}
        emptyText={loading ? t("Loading organizations…") : t("No organizations found")}
        disabled={disabled}
        inputId={id}
      />
    </div>
  );
};

export default OrganizationDropdown;
