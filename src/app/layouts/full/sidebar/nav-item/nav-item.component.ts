import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import { NavService } from 'src/app/core/services/nav.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { TranslateModule } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/core/services/login.service';
import { AppSideLoginComponent } from 'src/app/pages/authentication/side-login/side-login.component';

@Component({
  selector: 'app-nav-item',
  imports: [TranslateModule, TablerIconsModule, MaterialModule, CommonModule],
  templateUrl: './nav-item.component.html',
  styleUrls: [],
})
export class AppNavItemComponent implements OnChanges {
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() item: NavItem | any;

  expanded: any = false;

  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() depth: any;

  constructor(
    public navService: NavService,
    public router: Router,
    public dialog: MatDialog,
    public authService: LoginService,
    public sidebarService: SidebarService,
  ) {}

  ngOnChanges() {
    const url = this.navService.currentUrl();
    if (this.item.route && url) {
      this.expanded = url.indexOf(`/${this.item.route}`) === 0;
      this.ariaExpanded = this.expanded;
    }
  }

  onItemSelected(item: NavItem) {
    if (item.requiresAuth) {
      //} && !this.authService.isLoggedIn()) {
      const dialogRef = this.dialog.open(AppSideLoginComponent, {
        panelClass: 'boxed-auth',
        width: '500px',
        height: 'auto',
        disableClose: true,
        data: { targetRoute: item.route },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.success) {
          this.navigateOrExpand(item);
        }
      });
    } else {
      this.navigateOrExpand(item);
    }
  }
  navigateOrExpand(item: NavItem) {
    if (item.route) {
      this.router.navigate([item.route]);
    } else if (item.children?.length) {
      item.expanded = !item.expanded;
    }
  }
  openExternalLink(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  onSubItemSelected(item: NavItem) {
    if (item.requiresAuth) {
      // && !this.authService.isLoggedIn()) {
      const dialogRef = this.dialog.open(AppSideLoginComponent, {
        panelClass: 'boxed-auth',
        width: '500px',
        height: 'auto',
        disableClose: true,
        data: { targetRoute: item.route },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.success) {
          setTimeout(() => {
            this.router.navigate([item.route]);
          }, 10000);
        }
      });
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
  }
}
