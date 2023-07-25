import React from 'react';
import styled, { css } from 'styled-components';

import { Link } from '@portal/Link';
import type { ResolvedNavItem } from '@theme/types/portal';
import { useTranslate } from '@portal/hooks';

interface FooterColumnProps {
  column: ResolvedNavItem;
}

export function FooterColumn({ column }: FooterColumnProps): JSX.Element {
  const { translate } = useTranslate();
  const hasIcon = column.items ? column.items.some((item) => !!item.icon) : false;

  return (
    <FooterColumnContainer data-component-name="Footer/FooterColumn">
      <FooterColumnTitle withIconPadding={hasIcon}>
        {translate(column.labelTranslationKey, column.label)}
      </FooterColumnTitle>
      {column?.items?.map((columnItem, columnItemIndex) => {
        if (columnItem.type === 'error') {
          return null;
        }

        return columnItem.type === 'separator' ? (
          <FooterSeparator key={columnItem.label + '_' + columnItemIndex}>
            {translate(columnItem.labelTranslationKey, columnItem.label)}
          </FooterSeparator>
        ) : (
          <FooterLink
            key={columnItemIndex}
            to={columnItem.link}
            external={columnItem.external}
            target={columnItem.target}
            data-cy={columnItem.label}
          >
            <FooterLinkIcon url={columnItem.icon} withIconPadding={hasIcon} />
            {translate(columnItem.labelTranslationKey, columnItem.label)}
          </FooterLink>
        );
      })}
    </FooterColumnContainer>
  );
}

const FooterColumnTitle = styled.p<{ withIconPadding: boolean }>`
  display: inline-block;
  font-weight: var(--footer-title-font-weight);
  font-size: var(--footer-title-font-size);
  margin-bottom: var(--footer-title-margin-vertical);
  ${({ withIconPadding }) =>
    withIconPadding &&
    css`
      padding-left: calc(var(--footer-item-icon-width) + var(--footer-item-icon-margin-right));
    `}
  font-family: var(--footer-font-family);
  color: var(--footer-title-text-color);
`;

const FooterSeparator = styled.div`
  opacity: 0.75;
  margin: 10px 0 5px 0;
  font-size: 0.75em;
  text-transform: uppercase;
  font-family: var(--footer-font-family);
`;

const FooterColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: var(--footer-column-margin-horizontal) var(--footer-column-margin-vertical);
  width: var(--footer-column-width);
  word-break: break-word;
  margin-bottom: 40px;
`;

const FooterLink = styled(Link)`
  font-size: 0.8rem;
  font-weight: var(--font-weight-bold);
  padding: var(--footer-item-padding-vertical) var(--footer-item-padding-horizontal);
  color: var(--footer-link-text-color);
  text-decoration: none;
  &:hover {
    color: var(--footer-link-hover-color);
  }
`;

export const FooterLinkIcon = styled.i<{ url?: string; withIconPadding: boolean }>`
  ${({ withIconPadding, url }) =>
    withIconPadding &&
    !url &&
    css`
      padding-left: calc(var(--footer-item-icon-width) + var(--footer-item-icon-margin-right));
    `}
  ${({ url }) =>
    url &&
    css`
      background-image: url('${url}');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      width: var(--footer-item-icon-width);
      height: var(--footer-item-icon-height);
      display: inline-block;
      margin-right: var(--footer-item-icon-margin-right);
      vertical-align: middle;
    `}
`;
