import React from 'react';
import { Switch } from '../boardui/Switch';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  id,
  ariaLabel,
  disabled = false,
}) => {
  return (
    <Switch
      id={id}
      checked={checked}
      onChange={onChange}
      ariaLabel={ariaLabel}
      disabled={disabled}
    />
  );
};
