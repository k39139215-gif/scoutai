import React from 'react';
import { AuditTrailView } from './AuditTrailView';

export const SecurityView: React.FC = () => {
  return <AuditTrailView initialTab="security" />;
};
