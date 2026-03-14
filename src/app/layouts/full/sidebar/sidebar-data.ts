import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    children: [
      {
        displayName: 'Shop View',
        iconName: 'aperture',
        route: '/shop_view',
        requiresAuth: false,
      },
      {
        displayName: 'Inspection',
        iconName: 'aperture',
        route: '/inspection',
        requiresAuth: false,
      },
    ],
  },
  {
    displayName: 'Reports',
    iconName: 'book',
    requiresAuth: true,
    expanded: false,
    children: [
      {
        displayName: 'Report',
        iconName: 'aperture',
        route: '/report',
        requiresAuth: false,
      },
    ],
  },
  {
    displayName: 'Master Data',
    iconName: 'book',

    children: [
      {
        displayName: 'Equipment',
        iconName: 'aperture',
        route: '/equipment',
        requiresAuth: false,
      },
      {
        displayName: 'Model',
        iconName: 'aperture',
        route: '/model',
        requiresAuth: false,
      },
      {
        displayName: 'Variant',
        iconName: 'aperture',
        route: '/variant',
        requiresAuth: false,
      },
      {
        displayName: 'Shift',
        iconName: 'aperture',
        route: '/shift',
        requiresAuth: false,
      },
      {
        displayName: 'Breaks',
        iconName: 'aperture',
        route: '/breaks',
        requiresAuth: false,
      },
      {
        displayName: 'Recipes',
        iconName: 'aperture',
        route: '/recipes',
        requiresAuth: false,
      },
    ],
  },
];
