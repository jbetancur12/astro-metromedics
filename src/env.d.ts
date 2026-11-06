/// <reference types="astro/client" />

interface MmcsConsentDecision {
  analytics: boolean;
  marketing: boolean;
}

/** Administrador de consentimiento definido en AnalyticsScripts.astro. */
interface MmcsConsent extends MmcsConsentDecision {
  version: number;
  get: () => MmcsConsentDecision | null;
  set: (consent: MmcsConsentDecision) => MmcsConsentDecision;
  acceptAll: () => MmcsConsentDecision;
  rejectAll: () => MmcsConsentDecision;
  open: () => void;
  hasDecision: () => boolean;
}

interface Window {
  mmcsConsent?: MmcsConsent;
}
