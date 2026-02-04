import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { getPageTitle } from "../utils/pageTitles";

/**
 * Sets document.title and meta description based on the current route.
 * Renders Outlet so the router's child route is displayed.
 */
const PageTitleHandler: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = getPageTitle(pathname);

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const descriptions: Record<string, string> = {
        "/": "Sign in to your Semar account",
        "/sign-in": "Sign in to your Semar account",
        "/sign-up": "Create a Semar account",
        "/about-us":
          "Learn about Semar - payment and order management platform",
        "/privacy-policy": "Semar privacy policy and data handling",
        "/terms-and-conditions": "Semar terms and conditions",
      };
      const baseDesc = "Semar - Payment and order management platform";
      metaDescription.setAttribute(
        "content",
        descriptions[pathname] || baseDesc,
      );
    }
  }, [pathname]);

  return <Outlet />;
};

export default PageTitleHandler;
