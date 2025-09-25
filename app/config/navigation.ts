export interface NavItem {
  label: string;
  href: string;
  exact?: boolean;
  authOnly?: boolean; // if true, only show when user is authenticated
  icon?: React.ComponentType<{ className?: string }>;
}

// Central navigation definition (order matters for underline animation)
export const NAV_ITEMS: NavItem[] = [
  { label: 'Explore', href: '/explore' },
  { label: 'Favorites', href: '/favorites', authOnly: true },
  { label: 'Upload', href: '/upload', authOnly: true },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Community', href: '/community' },
];
