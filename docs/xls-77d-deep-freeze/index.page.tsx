import * as React from "react";
import {
  LandingContainer,
  LandingLayout,
  ButtonToXRPL,
} from "../../components/landing";
import { Button, Link } from "@redocly/theme";
import { Card } from "@redocly/theme/markdoc/components/Cards/Card";
import { Cards } from "@redocly/theme/markdoc/components/default";

export const frontmatter = {
  seo: {
    title: "XLS-77 Deep Freeze",
    description:
      "Learn how deep freeze helps prevent token misuse by frozen account holders.",
  },
};

export default function Page() {
  return (
    <LandingLayout>
      <LandingContainer>
      <div className="xls-77d-container">
        <div className="xls-77d-content">
          {/* Header Section */}
          <div className="xls-77d-header">
            <h1 className="xls-77d-title">XLS-0077 Deep Freeze</h1>
            <p className="xls-77d-subtitle">
              Prevent token misuse by frozen account holders.
            </p>
          </div>

          {/* Main Content Section */}
          <div className="xls-77d-main-content">
            {/* Left Column - Description */}
            <div className="xls-77d-description">
              <p>
                Deep freeze lets token issuers on the XRP Ledger prevent token
                misuse by frozen account holders. It enhances interactions
                between frozen assets and payments, ensuring that frozen token
                holders cannot receive funds until or unless their trust line is
                unfrozen. These changes enable token issuers to more easily
                comply with regulations on the XRPL.
              </p>
            </div>

            {/* Right Column - Key Dates */}
            <div className="xls-77d-key-dates">
              <h3 className="xls-77d-key-dates-title">Key Dates</h3>
              <div className="xls-77d-dates-list">
                <div className="xls-77d-date-item">
                  <span className="xls-77d-date">Dec 17, 2024</span>
                  <span className="xls-77d-event">
                    XLS Spec Review Complete
                  </span>
                </div>
                <div className="xls-77d-date-item">
                  <span className="xls-77d-date">Mar 06, 2025</span>
                  <span className="xls-77d-event">
                    Feature in rippled 2.4.0
                  </span>
                </div>
                <div className="xls-77d-date-item">
                  <span className="xls-77d-date">Mar 06, 2025</span>
                  <span className="xls-77d-event">Open for voting</span>
                </div>
                <div className="xls-77d-date-item">
                  <span className="xls-77d-date">TBA</span>
                  <span className="xls-77d-event">
                    Obtained ≥ 80% validators support
                  </span>
                </div>
                <div className="xls-77d-date-item">
                  <span className="xls-77d-date">TBA</span>
                  <span className="xls-77d-event">Enabled on Mainnet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Section */}
          <Cards columns={3}>
            <Card
              title="XLS Spec"
              to="https://github.com/XRPLF/XRPL-Standards/tree/master/XLS-0077-deep-freeze"
            >
              <p>
                Technical spec for the feature outlining requirements, design,
                and implementation details.{" "}
              </p>
              <Button size="large" variant="primary">
                Read the XLS Spec
              </Button>
            </Card>

            <Card
              title="Documentation"
              to="https://xrpl.org/docs/concepts/tokens/decentralized-exchange/permissioned-domains"
            >
              <p>
                Explore key concepts, find detailed references, and follow
                step-by-step tutorials.
              </p>
              <ButtonToXRPL>Read the Docs</ButtonToXRPL>
            </Card>

            <Card
              title="Blog"
              to="https://dev.to/ripplexdev/deep-freeze-strengthening-institutional-asset-control-on-xrpl-2j2a"
            >
              <p>
                An overview of the feature and why it matters to institutional
                issuers, explained in our blog post.
              </p>
              <Button size="large" variant="primary">
                Read the Blog
              </Button>
            </Card>
          </Cards>
        </div>
      </div>
      </LandingContainer>
    </LandingLayout>
  );
}
