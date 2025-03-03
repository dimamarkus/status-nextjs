import BaseLayout from "#/ui/_base/BaseLayout/BaseLayout";
import BaseSpaLayout from "#/ui/_base/BaseSpaLayout/BaseSpaLayout";
import TopBar from "#/ui/molecules/TopBar/TopBar";
import clsx from "clsx";
import React from "react";
import styles from "./LandingLayout.module.scss";
import { GlobalSettings } from "#/lib/types/cms";
import { getAvatarUrl } from "#/lib/helpers/url-helpers";
import Footer from "#/ui/molecules/Footer/Footer";

type LandingLayoutProps = {
  ssr?: boolean;
  children?: React.ReactNode;
  className?: string;
  globalSettings?: GlobalSettings;
};

export const LandingLayout = ({ children, ssr, globalSettings, className }: LandingLayoutProps) => {
  const logoUrl = getAvatarUrl(globalSettings?.logo, true);
  const Component = ssr ? BaseLayout : BaseSpaLayout;

  return (
    <Component>
      <div className={clsx(styles.root, className)}>
        <main role="main">
          <TopBar logo={ logoUrl }/>
          {children}
          <Footer />
        </main>
      </div>
    </Component>
  );
};

export default LandingLayout;
