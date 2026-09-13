"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "umbral_visitor_id";
const SESSION_KEY = "umbral_session_id";
const SESSION_STARTED_KEY = "umbral_session_started_at";

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

function getStorageValue(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;

  try {
    const current = window.localStorage.getItem(key);
    if (current) return current;
    window.localStorage.setItem(key, fallback);
    return fallback;
  } catch {
    return fallback;
  }
}

function getVisitorId() {
  return getStorageValue(VISITOR_KEY, createId("visitor"));
}

function getSessionId() {
  if (typeof window === "undefined") return createId("session");

  try {
    const current = window.sessionStorage.getItem(SESSION_KEY);
    if (current) return current;

    const next = createId("session");
    window.sessionStorage.setItem(SESSION_KEY, next);
    window.sessionStorage.setItem(SESSION_STARTED_KEY, new Date().toISOString());
    return next;
  } catch {
    return createId("session");
  }
}

function cleanText(value: string | null | undefined, max = 220) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function getUtmData() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: cleanText(params.get("utm_source"), 120),
    utm_medium: cleanText(params.get("utm_medium"), 120),
    utm_campaign: cleanText(params.get("utm_campaign"), 120),
    utm_term: cleanText(params.get("utm_term"), 120),
    utm_content: cleanText(params.get("utm_content"), 120)
  };
}

function sendAnalytics(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    path: window.location.pathname,
    page_title: document.title,
    referrer: document.referrer,
    screen_width: window.screen?.width || window.innerWidth,
    screen_height: window.screen?.height || window.innerHeight,
    language: navigator.language,
    user_agent: navigator.userAgent,
    ...getUtmData(),
    ...payload
  });

  try {
    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
      if (sent) return;
    }
  } catch {
    // Se intenta con fetch abajo.
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => undefined);
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const shouldTrack = useMemo(() => !pathname?.startsWith("/admin"), [pathname]);

  useEffect(() => {
    if (!shouldTrack) return;

    const timer = window.setTimeout(() => {
      sendAnalytics({ event_type: "page_view" });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [pathname, shouldTrack]);

  useEffect(() => {
    if (!shouldTrack) return;

    function handleClick(event: MouseEvent) {
      const target = event.target as Element | null;
      const element = target?.closest("a, button, [role='button'], input[type='button'], input[type='submit']") as HTMLElement | null;
      if (!element) return;

      const anchor = element instanceof HTMLAnchorElement ? element : element.closest("a");
      const text = cleanText(
        element.innerText ||
          element.getAttribute("aria-label") ||
          element.getAttribute("title") ||
          (element as HTMLInputElement).value ||
          anchor?.getAttribute("href") ||
          "Elemento sin texto",
        180
      );

      sendAnalytics({
        event_type: "click",
        element_text: text,
        element_tag: element.tagName.toLowerCase(),
        element_href: cleanText(anchor?.href || element.getAttribute("href") || "", 260),
        element_id: cleanText(element.id, 120),
        element_classes: cleanText(element.className, 220)
      });
    }

    function handleSelectChange(event: Event) {
      const element = event.target as HTMLSelectElement | null;
      if (!element || element.tagName.toLowerCase() !== "select") return;

      const selected = element.options[element.selectedIndex]?.text || element.value;
      const label = element.closest("label");
      const labelText = label
        ? cleanText(Array.from(label.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent).join(" "), 80)
        : "Selector";

      sendAnalytics({
        event_type: "click",
        element_text: `Selección: ${labelText || "Selector"} → ${cleanText(selected, 120)}`,
        element_tag: "select",
        element_href: "",
        element_id: cleanText(element.id, 120),
        element_classes: cleanText(element.className, 220)
      });
    }

    document.addEventListener("click", handleClick, { capture: true });
    document.addEventListener("change", handleSelectChange, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      document.removeEventListener("change", handleSelectChange, { capture: true });
    };
  }, [shouldTrack]);

  return null;
}
