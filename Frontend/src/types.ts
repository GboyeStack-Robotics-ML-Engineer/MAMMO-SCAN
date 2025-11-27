import {LucideIcon} from 'lucide-react'

export interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
}

export enum SectionId {
  HERO = 'hero',
  PROBLEM = 'problem',
  SOLUTION = 'solution',
  FEATURES = 'features',
  TEAM = 'team',
  CONTACT = 'contact'
}