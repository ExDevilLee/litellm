"use client";

import { Waypoints } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cva.config";
import { t } from "@/contexts/LanguageContext";

export interface RoutingDecisionTierBoundaries {
  simple_medium?: number;
  medium_complex?: number;
  complex_reasoning?: number;
}

export interface RoutingDecision {
  router_model_name?: string;
  router_type?: string;
  routed_model?: string;
  cause?: string;
  tier?: string;
  tier_label?: string;
  request_type?: string;
  score?: number;
  signals?: string[];
  matched_keyword?: string;
  escalation_keyword?: string;
  classifier_model?: string;
  escalated?: boolean;
  tier_boundaries?: RoutingDecisionTierBoundaries;
}

const ROUTER_TYPE_LABELS: Record<string, string> = {
  complexity: "Auto-Router v2",
  adaptive: "Adaptive router",
  quality: "Quality router",
};

/**
 * The tier the score alone would have produced, given the boundaries in effect when
 * the decision was made. Rendered as the bracket that explains a score, so it must
 * use the snapshot rather than today's config.
 */
function describeScoreAgainstBoundaries(
  score: number,
  boundaries?: RoutingDecisionTierBoundaries,
  renamed?: boolean,
): string | null {
  if (!boundaries) return null;
  const {
    simple_medium: simpleMedium,
    medium_complex: mediumComplex,
    complex_reasoning: complexReasoning,
  } = boundaries;
  if (simpleMedium === undefined || mediumComplex === undefined || complexReasoning === undefined) return null;

  const named = (range: string, tier: string): string => (renamed ? range : t("{0}, {1}", range, tier));
  if (score < simpleMedium) return named(t("below {0}", simpleMedium), "SIMPLE");
  if (score < mediumComplex) return named(t("{0} to {1}", simpleMedium, mediumComplex), "MEDIUM");
  if (score < complexReasoning) return named(t("{0} to {1}", mediumComplex, complexReasoning), "COMPLEX");
  return named(t("at or above {0}", complexReasoning), "REASONING");
}

function describeCause(decision: RoutingDecision): string {
  const { cause, classifier_model: classifierModel, matched_keyword: matchedKeyword, tier_label: tierLabel } = decision;

  switch (cause) {
    case "heuristic_scorer":
      return t("Heuristic scorer");
    case "reasoning_override":
      return t("Heuristic, {0} override (2 or more reasoning markers)", tierLabel ?? "REASONING");
    case "llm_classifier":
      return classifierModel ? t("LLM classifier ({0})", classifierModel) : t("LLM classifier");
    case "literal_keyword_match":
      return matchedKeyword ? t("Keyword match: \"{0}\"", matchedKeyword) : t("Keyword match");
    case "semantic_keyword_match":
      return t("Semantic keyword match");
    case "session_affinity_pin":
      return t("Pinned to session");
    case "session_affinity_escalation":
      return t("Escalated from session pin");
    case "quality_tier":
      return t("Quality tier mapping");
    case "keyword":
      return matchedKeyword ? t("Keyword match: \"{0}\"", matchedKeyword) : t("Keyword match");
    case "bandit":
      return t("Adaptive bandit");
    case "default_fallback":
      return t("Default model, no route matched");
    case "classifier_fallback":
      return t("Fallback tier, LLM classifier failed");
    case "default_model_fallback":
      return t("Default model, LLM classifier failed");
    default:
      return cause ?? t("Unknown");
  }
}

/**
 * A request can ask to escalate and get nowhere, when its tier is already the highest
 * one configured. That row still has to say the caller asked, otherwise it reads as an
 * ordinary route; it just must not claim a bump that did not happen. Only called when
 * the request escalated or asked to, so there is no "did not escalate" case.
 */
function describeEscalation(escalated: boolean, keyword: string | undefined): string {
  if (escalated) return keyword ? t("Yes, keyword \"{0}\"", keyword) : t("Yes");
  return keyword ? t("Requested via \"{0}\"; already at the highest tier", keyword) : t("Requested; already at the highest tier");
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-1 text-sm">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

export function RoutingDecisionCard({
  decision,
  className,
}: {
  decision?: RoutingDecision | null;
  className?: string;
}) {
  if (!decision || !decision.cause) return null;

  const {
    router_model_name: routerModelName,
    router_type: routerType,
    routed_model: routedModel,
    tier,
    tier_label: tierLabel,
    request_type: requestType,
    score,
    signals,
    escalated,
    escalation_keyword: escalationKeyword,
    tier_boundaries: tierBoundaries,
  } = decision;

  // On an override row the score did not decide the tier, so showing it against a
  // boundary would claim something untrue. Keyed off the cause rather than a marker
  // inside `signals`, which redaction can remove.
  const scoreExplanation =
    score !== undefined && decision.cause !== "reasoning_override"
      ? describeScoreAgainstBoundaries(score, tierBoundaries, tierLabel !== undefined)
      : null;

  return (
    <div className={cn("mb-6 w-full max-w-full overflow-hidden rounded-lg bg-white shadow-sm", className)}>
      <div className="border-b px-4 py-2.5 text-sm font-medium">{t("Routing")}</div>
      <div className="px-4 py-3">
        {routerModelName && (
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Waypoints size={14} aria-hidden />
            <span>{routerModelName}</span>
            {routerType && (
              <span className="font-normal text-muted-foreground">
                ({ROUTER_TYPE_LABELS[routerType] ? t(ROUTER_TYPE_LABELS[routerType]) : routerType})
              </span>
            )}
          </div>
        )}

        {tier && (
          <Row label={t("Tier")}>
            <Badge variant="secondary" className="font-normal">
              {tierLabel ?? tier}
            </Badge>
          </Row>
        )}

        {requestType && <Row label={t("Request type")}>{requestType}</Row>}

        <Row label={t("Decided by")}>{describeCause(decision)}</Row>

        {score !== undefined && (
          <Row label={t("Score")}>
            <span className="tabular-nums">{score.toFixed(2)}</span>
            {scoreExplanation && <span className="ml-2 text-muted-foreground">({scoreExplanation})</span>}
          </Row>
        )}

        {routedModel && <Row label={t("Routed to")}>{routedModel}</Row>}

        {escalated !== undefined && <Row label={t("Escalated")}>{describeEscalation(escalated, escalationKeyword)}</Row>}

        {signals && signals.length > 0 && (
          <Row label={t("Signals")}>
            <span className="flex flex-wrap gap-1">
              {signals.map((signal) => (
                <Badge key={signal} variant="outline" className="font-normal">
                  {signal}
                </Badge>
              ))}
            </span>
          </Row>
        )}
      </div>
    </div>
  );
}

export default RoutingDecisionCard;
