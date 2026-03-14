export interface NavItem {
  displayName?: string;
  iconName?: string;
  navCap?: string;
  route?: string;
  children?: NavItem[];
  requiresAuth?: boolean;
  chip?: boolean;
  chipContent?: string;
  chipClass?: string;
  external?: boolean;
  expanded?: boolean;
}
