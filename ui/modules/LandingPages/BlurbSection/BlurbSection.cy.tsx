import React from "react";
import BlurbSection from "./BlurbSection";

describe("<BlurbSection />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <BlurbSection
        heading={null}
        subheading={null}
        description={null}
        id={0}
        __component={"sections.blurb-section"}
        blurbs={[]}
      />,
    );
    cy.get("[class^=BlurbSection_]").should("exist");
  });
});
