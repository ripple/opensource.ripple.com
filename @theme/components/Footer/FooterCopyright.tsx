import React from 'react';
import styled from 'styled-components';

import { useTranslate } from '@portal/hooks';

interface FooterCopyrightProps {
  copyrightText: string;
}

export function FooterCopyright({ copyrightText = '' }: FooterCopyrightProps): JSX.Element | null {
  const { translate } = useTranslate();
  const translationKeys = {
    copyrightText: 'theme.footer.copyrightText',
  };
  return copyrightText ? (
    <Wrapper data-component-name="Footer/FooterCopyright" data-translation-key={translationKeys.copyrightText}>
      {translate(translationKeys.copyrightText, copyrightText)}
    </Wrapper>
  ) : null;
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  /* padding: 0 0 30px 0; */
  margin: 0;
  height: 100%;
  background-color: var(--footer-background-color);
  color: var(--footer-text-color);
  text-align: center;
  @media (max-width: 798px) {
    justify-content: center;
    margin-top: 0;
    height: auto;
    padding: 0 0 20px 0;
  }
`;
