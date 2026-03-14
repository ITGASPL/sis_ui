import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { navItems } from './sidebar-data';
import { NavItem } from './nav-item/nav-item';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/core/services/login.service';
import { AppSideLoginComponent } from 'src/app/pages/authentication/side-login/side-login.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BrandingComponent,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  navItems: NavItem[] = navItems;

  constructor(
    private dialog: MatDialog,
    private authService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {}
}
