export interface Project {
  tokenId: number;
  name: string;
  githubLink?: string;
  documentHash?: string;
  owner: string;
  timestamp: number;
  tags: string[];
  domain: Domain;
  metadata?: ProjectMetadata;
  votes?: number;
}

export interface ProjectMetadata {
  description?: string;
  fileUrl?: string;
  certificateType?: string;
  institution?: string;
  grade?: string;
  artworkType?: string;
  researchField?: string;
  gameAssetType?: string;
}

export enum Domain {
  UNIVERSITY = 'university',
  LEGAL = 'legal',
  ARTIST = 'artist',
  RESEARCH = 'research',
  GAMING = 'gaming',
  DEVELOPER = 'developer'
}

export interface DomainConfig {
  name: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
  fields: FormField[];
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'file' | 'tags';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface Certificate {
  tokenId: number;
  recipient: string;
  issuer: string;
  title: string;
  description: string;
  domain: Domain;
  timestamp: number;
  metadata: any;
}