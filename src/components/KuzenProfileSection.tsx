'use client';

import React from 'react';
import { KuzenProfileCard } from './KuzenProfileCard';
import { KuzenProfile, UserRole } from '@/types';

interface KuzenProfileSectionProps {
  profile: KuzenProfile;
  userRole: UserRole;
  onUpdateProfile: (updated: KuzenProfile) => void;
}

export const KuzenProfileSection: React.FC<KuzenProfileSectionProps> = (props) => {
  return <KuzenProfileCard {...props} />;
};
