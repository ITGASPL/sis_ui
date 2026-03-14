import { Injectable } from '@angular/core';
import { navItems } from '../../layouts/full/sidebar/sidebar-data';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  items = navItems;

  /** Collapse all expanded menus recursively */
  collapseAll(items = this.items): void {
    for (const item of items) {
      item.expanded = false;
      if (item.children?.length) {
        this.collapseAll(item.children);
      }
    }
  }
}
