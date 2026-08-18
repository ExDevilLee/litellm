import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";
import { t } from "@/contexts/LanguageContext";

interface ImpactResult {
  affected_keys_count: number;
  affected_teams_count: number;
  sample_keys: string[];
  sample_teams: string[];
}

interface ImpactPreviewAlertProps {
  impactResult: ImpactResult;
}

interface SampleListProps {
  label: string;
  samples: string[];
  totalCount: number;
}
const SampleList: React.FC<SampleListProps> = ({ label, samples, totalCount }) => (
  <div className="mt-1 flex flex-wrap items-center gap-1">
    <span className="text-xs text-muted-foreground">{label}: </span>
    {samples.slice(0, 5).map((sample) => (
      <Badge key={sample} variant="outline">
        {sample}
      </Badge>
    ))}
    {totalCount > 5 && <span className="text-xs text-muted-foreground">{t("and {0} more...", totalCount - 5)}</span>}
  </div>
);

const ImpactPreviewAlert: React.FC<ImpactPreviewAlertProps> = ({ impactResult }) => {
  const isGlobal = impactResult.affected_keys_count === -1;

  return (
    <Alert className="mb-4">
      {isGlobal ? <AlertTriangle /> : <Info />}
      <AlertTitle>{t("Impact Preview")}</AlertTitle>
      <AlertDescription>
        {isGlobal ? (
          <span>
            {t("Global scope — this will affect ")}<strong>{t("all keys and teams")}</strong>.
          </span>
        ) : (
          <div>
            <span>
              {t("This attachment would affect ")}
              <strong>
                {impactResult.affected_keys_count} {t(impactResult.affected_keys_count !== 1 ? "keys" : "key")}
              </strong>{" "}
              {t("and")}{" "}
              <strong>
                {impactResult.affected_teams_count} {t(impactResult.affected_teams_count !== 1 ? "teams" : "team")}
              </strong>
              .
            </span>
            {impactResult.sample_keys.length > 0 && (
              <SampleList
                label={t("Keys")}
                samples={impactResult.sample_keys}
                totalCount={impactResult.affected_keys_count}
              />
            )}
            {impactResult.sample_teams.length > 0 && (
              <SampleList
                label={t("Teams")}
                samples={impactResult.sample_teams}
                totalCount={impactResult.affected_teams_count}
              />
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ImpactPreviewAlert;
