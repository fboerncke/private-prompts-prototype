// src/utils/BadgeUtils.ts

import { BadgeColors } from "../interfaces/BadgeColors";
import type { HistoryEntry } from "../interfaces/HistoryEntryInterface";
import { useI18n } from 'vue-i18n';

export const getBadgeIcon = (entry: HistoryEntry) => {
  if (entry.type === "source") {
    return "mdi-text-box";
  } else if (entry.type === "result") {
    switch (entry.operation) {
      case "masked":
        return "mdi-shield-lock";
      case "unmasked":
        return "mdi-fingerprint";
      case "marked":
        return "mdi-pen";
      case "processed":
        return "mdi-send";
    }
  }
  return "";
};

export const getBadgeColor = (entry: HistoryEntry, colors: BadgeColors) => {
  if (entry.type === "source") {
    return colors.sourceBadgeColor;
  } else if (entry.type === "result") {
    switch (entry.operation) {
      case "masked":
        return colors.maskedBadgeColor;
      case "unmasked":
        return colors.unmaskedBadgeColor;
      case "marked":
        return colors.markedBadgeColor;
      case "processed":
        return colors.processedBadgeColor;
    }
  }
  return "";
};

export const getBadgeText = (entry: HistoryEntry) => {
  const { t } = useI18n();
  if (entry.type === "source") {
    return t('badgeStrings.user-prompt');
  } else if (entry.type === "result") {
    switch (entry.operation) {
      case "masked":
        return t('badgeStrings.masked-prompt');
      case "unmasked":
        return t('badgeStrings.unmasked-prompt');
      case "marked":
        return t('badgeStrings.marked-prompt');
      case "processed":
        return t('badgeStrings.processed-prompt');
    }
  }
  return "";
};

export const getBadgeXoffset = (entry: HistoryEntry) => {
  if (entry.type === "source") {
    return 89;
  } else if (entry.operation === "masked") {
    return 106;
  } else if (entry.operation === "unmasked") {
    return 122;
  } else if (entry.operation === "marked") {
    return 105;
  } else if (entry.operation === "processed") {
    return 120;
  } else if (entry.operation === "clone") {
    return 100;
  }
};
// 'masked' | 'unmasked' | 'marked' | 'processed' | 'clone';
