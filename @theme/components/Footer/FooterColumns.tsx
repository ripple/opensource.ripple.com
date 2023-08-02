import React from 'react';
import styled from 'styled-components';

import { FooterColumn } from '@theme/components/Footer/FooterColumn';
import type { ResolvedNavItem } from '@theme/types/portal';


import { FooterCopyright } from '@theme/components/Footer/FooterCopyright';


interface FooterColumnsProps {
  columns: ResolvedNavItem[];
  copyrightText: string;
}

export function FooterColumns({ columns, copyrightText }: FooterColumnsProps): JSX.Element | null {
  if (!columns?.length) {
    return null;
  }

  return (
    <FooterColumnsContainer data-component-name="Footer/FooterColumns">
      <FooterRow>
        {columns.map((column, index) => (
          <FooterColumn key={`${column.label}_${index}`} column={column} />
        ))}
      <FooterCopyright copyrightText={copyrightText}/>
      </FooterRow>
    </FooterColumnsContainer>
  );
}

export const FooterColumnsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: var(--footer-container-max-width);

  ${({ theme }) => theme.mediaQueries.small} {
    padding: 5.625em 20px 3.9375em 20px;
  }

  ${({ theme }) => theme.mediaQueries.print} {
    color: black;
    display: none;
  }
`;

export const FooterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  /* ${({ theme }) => theme.mediaQueries.small} {
    justify-content: space-evenly;
  } */
  @media (max-width: 635px) {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
`;
