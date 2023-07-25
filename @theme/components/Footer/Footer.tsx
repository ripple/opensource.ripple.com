import React from 'react';
import styled from 'styled-components';

import { FooterColumns } from '@theme/components/Footer/FooterColumns';

import { isEmptyArray } from '@theme/utils';
import { useThemeConfig } from '@theme/hooks';
import type { ResolvedNavItem } from '@theme/types/portal';

export function Footer(): JSX.Element | null {
  const { footer } = useThemeConfig() || {};
  const { items, copyrightText } = footer || {};

  if (isEmptyArray(items) || !copyrightText || footer?.hide) {
    return null;
  }

  return (
    <FooterPresentationalComponent
      items={items as ResolvedNavItem[]}
      copyrightText={copyrightText}
    />
  );
}

interface FooterPresentationalComponentProps {
  items: ResolvedNavItem[];
  copyrightText: string;
}

export function FooterPresentationalComponent({
  items,
  copyrightText,
}: FooterPresentationalComponentProps): JSX.Element | null {
  return (
    <FooterContainer data-component-name="Footer/Footer">
      <FooterColumns copyrightText={copyrightText} columns={items as ResolvedNavItem[]} />
    </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  border-top: 0.5px solid var(--footer-border-color);
  font-size: var(--footer-font-size);
  background-color: var(--footer-background-color);
  color: var(--footer-text-color);
  font-family: var(--footer-font-family);
  font-weight: var(--footer-font-weight);
  a,
  a:hover {
    color: var(--footer-text-color);
  }
  @media (max-width: 798px) {
    display: flex;
    flex-direction: column;
  }
`;
