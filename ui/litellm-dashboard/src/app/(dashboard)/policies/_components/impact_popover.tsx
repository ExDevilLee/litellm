import React, { useState } from "react";
import { Icon } from "@tremor/react";
import { EyeIcon } from "@heroicons/react/outline";
import { Tooltip, Tag, Popover, Spin } from "antd";
import { PolicyAttachment } from "@/components/policies/types";
import { estimateAttachmentImpactCall } from "@/components/networking";
import { t } from "@/contexts/LanguageContext";

const ImpactPopover: React.FC<{ attachment: PolicyAttachment; accessToken: string | null }> = ({
  attachment,
  accessToken,
}) => {
  const [impact, setImpact] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadImpact = async () => {
    if (loaded || loading || !accessToken) return;
    setLoading(true);
    try {
      const data = await estimateAttachmentImpactCall(accessToken, {
        policy_name: attachment.policy_name,
        scope: attachment.scope,
        teams: attachment.teams,
        keys: attachment.keys,
        models: attachment.models,
        tags: attachment.tags,
      });
      setImpact(data);
      setLoaded(true);
    } catch (error) {
      console.error("Failed to load impact:", error);
    } finally {
      setLoading(false);
    }
  };

  const content = loading ? (
    <div className="p-2 text-center">
      <Spin size="small" /> {t("Loading...")}
    </div>
  ) : impact ? (
    <div className="text-xs" style={{ maxWidth: 280 }}>
      {impact.affected_keys_count === -1 ? (
        <p className="font-medium text-amber-600">{t("Global scope — affects all keys and teams")}</p>
      ) : (
        <>
          <p className="mb-1">
            <strong>{impact.affected_keys_count}</strong> {t(impact.affected_keys_count !== 1 ? "keys," : "key,")} {" "}
            <strong>{impact.affected_teams_count}</strong>{" "}
            {t(impact.affected_teams_count !== 1 ? "teams affected" : "team affected")}
          </p>
          {impact.sample_keys.length > 0 && (
            <div className="mb-1">
              <span className="text-gray-500">{t("Keys: ")}</span>
              {impact.sample_keys.map((k: string) => (
                <Tag key={k} style={{ fontSize: 10, margin: 1 }}>
                  {k}
                </Tag>
              ))}
            </div>
          )}
          {impact.sample_teams.length > 0 && (
            <div>
              <span className="text-gray-500">{t("Teams: ")}</span>
              {impact.sample_teams.map((t: string) => (
                <Tag key={t} style={{ fontSize: 10, margin: 1 }}>
                  {t}
                </Tag>
              ))}
            </div>
          )}
          {impact.affected_keys_count === 0 && impact.affected_teams_count === 0 && (
            <p className="text-gray-400">{t("No keys or teams currently affected")}</p>
          )}
        </>
      )}
    </div>
  ) : (
    <p className="text-xs text-gray-400">{t("Click to load")}</p>
  );

  return (
    <Popover
      content={content}
      title={t("Blast Radius")}
      trigger="click"
      onOpenChange={(open) => {
        if (open) loadImpact();
      }}
    >
      <Tooltip title={t("View blast radius")}>
        <Icon icon={EyeIcon} size="sm" className="cursor-pointer hover:text-blue-500" />
      </Tooltip>
    </Popover>
  );
};

export default ImpactPopover;
