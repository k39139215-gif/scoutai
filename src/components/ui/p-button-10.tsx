import React from 'react';
import { Button, type ButtonProps } from './button';

/**
 * Coss UI: p-button-10 (Large button)
 * Official registry particle: @coss/p-button-10
 * Sourced from: https://coss.com/ui/r/p-button-10.json
 *
 * Renders a large (40px height, 14px font size, 16px horizontal padding)
 * Base UI / Coss design system button.
 */
export const PButton10: React.FC<ButtonProps> = ({
  children = 'Button',
  size = 'lg',
  variant = 'default',
  ...props
}) => {
  return (
    <Button size={size} variant={variant} {...props}>
      {children}
    </Button>
  );
};

export default PButton10;
