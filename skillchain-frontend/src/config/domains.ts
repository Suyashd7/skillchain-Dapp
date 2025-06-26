import { DomainConfig, Domain } from '../types';

export const domainConfigs: Record<Domain, DomainConfig> = {
  [Domain.UNIVERSITY]: {
    name: 'Universities',
    icon: '🎓',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: 'Digital certificates, transcripts, and academic credentials verification',
    features: [
      'Digital Diploma Issuance',
      'Transcript Verification',
      'Academic Achievement Tracking',
      'Alumni Network Integration'
    ],
    fields: [
      { name: 'title', label: 'Certificate Title', type: 'text', required: true, placeholder: 'Bachelor of Science in Computer Science' },
      { name: 'institution', label: 'Institution Name', type: 'text', required: true, placeholder: 'University of Technology' },
      { name: 'recipient', label: 'Recipient Name', type: 'text', required: true, placeholder: 'John Doe' },
      { name: 'grade', label: 'Grade/GPA', type: 'text', required: false, placeholder: '3.8/4.0' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Additional details about the certificate' },
      { name: 'document', label: 'Certificate Document', type: 'file', required: true },
      { name: 'tags', label: 'Tags', type: 'tags', required: false, placeholder: 'Computer Science, Technology, Bachelor' }
    ]
  },
  [Domain.LEGAL]: {
    name: 'Legal Professionals',
    icon: '⚖️',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: 'Document verification, contract management, and legal credential tracking',
    features: [
      'Document Authentication',
      'Contract Verification',
      'Legal Credential Management',
      'Case File Security'
    ],
    fields: [
      { name: 'title', label: 'Document Title', type: 'text', required: true, placeholder: 'Legal Contract Agreement' },
      { name: 'documentType', label: 'Document Type', type: 'select', required: true, options: ['Contract', 'Certificate', 'License', 'Court Document', 'Other'] },
      { name: 'parties', label: 'Parties Involved', type: 'text', required: false, placeholder: 'Party A, Party B' },
      { name: 'jurisdiction', label: 'Jurisdiction', type: 'text', required: false, placeholder: 'New York, USA' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Document details and purpose' },
      { name: 'document', label: 'Legal Document', type: 'file', required: true },
      { name: 'tags', label: 'Tags', type: 'tags', required: false, placeholder: 'Contract, Legal, Business' }
    ]
  },
  [Domain.ARTIST]: {
    name: 'Artists & Creators',
    icon: '🎨',
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    description: 'Artwork authentication, ownership verification, and creative portfolio management',
    features: [
      'Artwork Authentication',
      'Ownership Certificates',
      'Creative Portfolio',
      'Royalty Tracking'
    ],
    fields: [
      { name: 'title', label: 'Artwork Title', type: 'text', required: true, placeholder: 'Digital Masterpiece #1' },
      { name: 'artworkType', label: 'Artwork Type', type: 'select', required: true, options: ['Digital Art', 'Photography', 'Music', 'Video', 'Literature', 'Other'] },
      { name: 'artist', label: 'Artist Name', type: 'text', required: true, placeholder: 'Artist Name' },
      { name: 'medium', label: 'Medium/Format', type: 'text', required: false, placeholder: 'Digital, Oil on Canvas, etc.' },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Artwork description and inspiration' },
      { name: 'document', label: 'Artwork File', type: 'file', required: true },
      { name: 'tags', label: 'Tags', type: 'tags', required: false, placeholder: 'Digital Art, Abstract, Modern' }
    ]
  },
  [Domain.RESEARCH]: {
    name: 'Researchers',
    icon: '🔬',
    color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    description: 'Research paper verification, intellectual property protection, and academic collaboration',
    features: [
      'Research Paper Verification',
      'IP Protection',
      'Collaboration Tracking',
      'Citation Management'
    ],
    fields: [
      { name: 'title', label: 'Research Title', type: 'text', required: true, placeholder: 'Novel Approach to Machine Learning' },
      { name: 'researchField', label: 'Research Field', type: 'select', required: true, options: ['Computer Science', 'Biology', 'Physics', 'Chemistry', 'Medicine', 'Engineering', 'Other'] },
      { name: 'authors', label: 'Authors', type: 'text', required: true, placeholder: 'Dr. Jane Smith, Dr. John Doe' },
      { name: 'institution', label: 'Institution', type: 'text', required: false, placeholder: 'Research University' },
      { name: 'abstract', label: 'Abstract', type: 'textarea', required: false, placeholder: 'Brief summary of the research' },
      { name: 'document', label: 'Research Document', type: 'file', required: true },
      { name: 'tags', label: 'Tags', type: 'tags', required: false, placeholder: 'Machine Learning, AI, Research' }
    ]
  },
  [Domain.GAMING]: {
    name: 'Gaming Companies',
    icon: '🎮',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: 'Game asset ownership, achievement tracking, and digital collectible management',
    features: [
      'Asset Ownership Tracking',
      'Achievement Certificates',
      'Digital Collectibles',
      'Player Verification'
    ],
    fields: [
      { name: 'title', label: 'Asset/Achievement Title', type: 'text', required: true, placeholder: 'Legendary Sword of Power' },
      { name: 'gameAssetType', label: 'Asset Type', type: 'select', required: true, options: ['Weapon', 'Character', 'Achievement', 'Collectible', 'Currency', 'Other'] },
      { name: 'game', label: 'Game Title', type: 'text', required: true, placeholder: 'Epic Adventure Game' },
      { name: 'rarity', label: 'Rarity Level', type: 'select', required: false, options: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] },
      { name: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Asset description and properties' },
      { name: 'document', label: 'Asset Image/File', type: 'file', required: true },
      { name: 'tags', label: 'Tags', type: 'tags', required: false, placeholder: 'Gaming, NFT, Collectible' }
    ]
  },
  [Domain.DEVELOPER]: {
    name: 'Developers',
    icon: '💻',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: 'Code verification, project showcasing, and developer credential management',
    features: [
      'Project Verification',
      'Code Authentication',
      'Skill Certification',
      'Portfolio Management'
    ],
    fields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true, placeholder: 'Awesome Web3 DApp' },
      { name: 'githubLink', label: 'GitHub Repository', type: 'text', required: false, placeholder: 'https://github.com/user/repo' },
      { name: 'techStack', label: 'Technology Stack', type: 'text', required: false, placeholder: 'React, Solidity, Node.js' },
      { name: 'description', label: 'Project Description', type: 'textarea', required: false, placeholder: 'Detailed project description' },
      { name: 'document', label: 'Project Documentation', type: 'file', required: false },
      { name: 'tags', label: 'Tags', type: 'tags', required: false, placeholder: 'Web3, React, Blockchain' }
    ]
  }
};