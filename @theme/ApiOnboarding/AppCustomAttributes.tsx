import * as React from 'react';
import styled from 'styled-components';
import { H3 } from '@redocly/theme';

interface AppCustomAttributesProps {
  onChange: (value: Record<string, string>, valid: boolean) => void;
}
export function AppCustomAttributes(props: AppCustomAttributesProps) {
  const { onChange } = props;

  const [customAttributes, setCustomAttributes] = React.useState<Record<string, string>>({});
  const handleCustomAttributeChange = React.useCallback(
    e => setCustomAttributes({ ...customAttributes, [e.target.name]: e.target.value }),
    [customAttributes]
  );

  React.useEffect(() => {
    const isValid =  !!customAttributes.role; // role is required
    onChange(customAttributes, isValid);
  }, [customAttributes, onChange]);

  return (
    <>
      <H3>Additional details</H3>
      <CustomAttributeRow>
        <CustomAttributeLabel required>
          Your role
        </CustomAttributeLabel>
        <CustomAttributeSelect required name="role" onChange={handleCustomAttributeChange}>
          <option value="">Select</option>
          <option value="developer">Developer</option>
          <option value="qa">QA</option>
          <option value="pm">PM</option>
        </CustomAttributeSelect>
      </CustomAttributeRow>
      <CustomAttributeRow>
        <CustomAttributeLabel> Usage priority (1-5) </CustomAttributeLabel>
        <CustomAttributeInput
          type="number"
          required
          name="priority"
          min="0"
          max="5"
          onChange={handleCustomAttributeChange}
        />
      </CustomAttributeRow>
    </>
  );
}

const CustomAttributeRow = styled.div`
  margin-bottom: 10px;

  input,
  select {
    border: 1px solid rgba(0, 0, 0, 0.23);
    padding: 4px;
    border-radius: 4px;
    padding: 10px;
    min-width: 200px;
    outline-color: var(--color-primary-500);
    transition: outline 0.25s ease;
    display: inline-block;
    text-align: left;
    appearance: none;
  }

  select {
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 1em;
  }
`;

const CustomAttributeLabel = styled.label<{required: boolean}>`
  display: inline-block;
  width: 150px;

  ${({ required }) => required && `
    &::after {
      content: ' *';
      color: red;
    }
  `}
`;

const CustomAttributeSelect = styled.select`
  width: 100px;
  text-align: left;
`;

const CustomAttributeInput = styled.input`
`;
