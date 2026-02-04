const APP_NAME = "Semar";

/** Format a path segment into a display title (e.g. "admin-management" -> "Admin Management") */
function formatSegment(segment: string): string {
  if (!segment) return "";
  if (segment.toLowerCase() === "upi") return "UPI";
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/** Static route titles for public pages */
const STATIC_TITLES: Record<string, string> = {
  "/": "Sign In",
  "/sign-in": "Sign In",
  "/sign-up": "Sign Up",
  "/about-us": "About Us",
  "/privacy-policy": "Privacy Policy",
  "/terms-and-conditions": "Terms & Conditions",
};

/**
 * Get the document title for the current pathname.
 * Dashboard routes like /admin/overview become "Overview | Semar".
 */
export function getPageTitle(pathname: string): string {
  const staticTitle = STATIC_TITLES[pathname];
  if (staticTitle) {
    return `${staticTitle} | ${APP_NAME}`;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return APP_NAME;
  }

  // Dashboard routes: /admin/overview -> "Overview | Semar", /admin/payin-order/123 -> "Payin Order | Semar"
  let segmentToFormat = segments[segments.length - 1];
  // If last segment looks like an ID (numeric or UUID), use the previous segment for the title
  if (
    /^\d+$/.test(segmentToFormat) ||
    /^[0-9a-f-]{36}$/i.test(segmentToFormat)
  ) {
    segmentToFormat = segments[segments.length - 2] ?? segmentToFormat;
  }
  const pageName = formatSegment(segmentToFormat);
  if (pageName) {
    return `${pageName} | ${APP_NAME}`;
  }

  return APP_NAME;
}
