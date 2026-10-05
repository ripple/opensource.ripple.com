import * as React from 'react';

type ExternalLinkProps = React.HTMLAttributes<HTMLElement> & {
  href: string;
};

/**
 * An external link component.
 *
 * @param {string} href The url to open.
 * @returns A {@link JSX.Element}.
 */
export const ExternalLink: React.FC<ExternalLinkProps> = ({ children, href }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};
