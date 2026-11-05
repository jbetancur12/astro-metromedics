// Eventos de medición vía dataLayer. GTM (GTM-MB52DKRX) decide qué etiquetas
// disparar con cada uno (GA4, etc.); el sitio no llama a gtag directamente.
// Sin consentimiento de analítica no se encola nada: la decisión se guarda en
// localStorage (`mmcs_cookie_consent`) y la administra CookieConsent.
export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (!w.mmcsConsent?.get?.()?.analytics) return;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}

// Contacto completado. Nombre recomendado por GA4 para clientes potenciales.
export function trackLead(formName: string, params: Record<string, unknown> = {}) {
  trackEvent("generate_lead", { form_name: formName, ...params });
}
