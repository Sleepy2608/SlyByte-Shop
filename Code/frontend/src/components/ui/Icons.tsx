import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const defaultProps = (size: number): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

export const IconShoppingBag: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const IconSearch: React.FC<IconProps> = ({ size = 18, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const IconLaptop: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M2 20h20" />
  </svg>
);

export const IconSmartphone: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <rect x="6" y="2" width="12" height="20" rx="2" />
    <path d="M12 18h.01" />
  </svg>
);

export const IconCpu: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

export const IconShieldCheck: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconRefresh: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export const IconBolt: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export const IconLock: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const IconCreditCard: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

export const IconBank: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="m3 9 9-6 9 6" />
    <path d="M4 10h16" />
    <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
    <path d="M3 18h18" />
    <path d="M2 21h20" />
  </svg>
);

export const IconCash: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

export const IconPackage: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="m16.5 9.4-9-5.19" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);

export const IconChart: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M3 3v18h18" />
    <path d="M7 16v-5" />
    <path d="M12 16V8" />
    <path d="M17 16v-3" />
  </svg>
);

export const IconUsers: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconStore: React.FC<IconProps> = ({ size = 20, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
  </svg>
);

export const IconLogOut: React.FC<IconProps> = ({ size = 18, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ size = 16, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconX: React.FC<IconProps> = ({ size = 16, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const IconTrash: React.FC<IconProps> = ({ size = 16, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

export const IconArrowRight: React.FC<IconProps> = ({ size = 16, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const IconArrowLeft: React.FC<IconProps> = ({ size = 16, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const IconAlertOctagon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg {...defaultProps(size)} {...props}>
    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

