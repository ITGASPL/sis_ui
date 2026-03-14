import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { WebsocketService } from 'src/app/websocket.service';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatDialog } from '@angular/material/dialog';
import { AlertTableComponent } from '../../../shared/components/alert-table/alert-table.component';
import { AlertService } from 'src/app/core/services/alert.service';
import { interval, Subscription } from 'rxjs';
import { sampleTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { CustomSnackbarComponent } from 'src/app/shared/components/custom-component/custom-snackbar.component';
interface WebSocketPacket {
  type: string;
  machineNumber: string;
  errorCode: string;
  severity: string;
  sheetNumber: string;
  description: string;
  timestamp: string;
}

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit, OnDestroy {
  unreadCount: number = 0;
  latestErrorData: {} = {};
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  private unreadTimer: any;
  private callUnreadCount = true;
  private subscription!: Subscription;
  constructor(
    private dialog: MatDialog,
    private alertService: AlertService,
    private wsService: WebsocketService,
    private snackBar: MatSnackBar,
    private router: Router,
    private sidebarService: SidebarService,
  ) {}

  getUnreadCount() {
    this.alertService.getUnreadCount().subscribe((res) => {
      if (res && res.success) {
        console.log('Unread count fetched:', res);
        this.unreadCount = res.unreadCount;
      }
    });
  }
  markAsRead() {
    this.alertService.markAsRead().subscribe((res) => {
      if (res && res.success) {
        console.log('Alerts marked as read', res);
      }
    });
  }

  ngOnInit() {
    this.getUnreadCount();

    this.subscription = this.wsService
      .connect('ws://192.168.4.100:8000/SIS/ws/messages')
      .pipe(sampleTime(100))
      .subscribe((data) => {
        console.log('Received:', data);
        if (data) {
          console.log('Received:', data);
          const errorData = this.parseErrorData(data);
          if (errorData) {
            this.latestErrorData = errorData;
            console.log('Parsed Data:', errorData);

            if (this.callUnreadCount) {
              this.callUnreadCount = false;
              this.unreadTimer = setTimeout(() => {
                this.getUnreadCount();
                this.callUnreadCount = true; // Unlock after 3 seconds
              }, 3000);
            } else {
              console.log('⏳ Skipping API call - waiting for 3s cooldown');
            }
          }
        }
      });
  }

  ngOnDestroy() {}

  openNotifications() {
    this.markAsRead();
    this.dialog.open(AlertTableComponent, {
      width: '1600px',
      height: 'auto',
      maxWidth: '100vw',
      panelClass: 'custom-dialog-container',
    });
  }

  parseErrorData(raw: string): WebSocketPacket | null {
    try {
      const cleaned = raw.replace(/^\*/, '').replace(/<CR>$/, '');
      const parts = cleaned.split(',');
      if (parts.length < 7) {
        this.snackBar.open('Failed to parse error packet', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['error-snackbar'],
        });
        return null;
      }

      const errorData: WebSocketPacket = {
        type: parts[0],
        machineNumber: parts[1],
        errorCode: parts[2],
        severity: parts[3],
        sheetNumber: parts[4],
        description: parts.slice(5, -1).join(','),
        timestamp: parts[parts.length - 1],
      };

      const message = `Error Code: ${errorData.type} | ${errorData.errorCode},
Severity: ${errorData.severity},
Sheet: ${errorData.sheetNumber},
Description: ${errorData.description}`;

      this.snackBar.openFromComponent(CustomSnackbarComponent, {
        data: {
          message: message,
          styles: {
            backgroundColor:
              errorData.severity === 'ERROR' ? '#f44336' : '#ff9800',
            color: '#fff',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          },
        },
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });

      return errorData;
    } catch (e) {
      console.error('Packet parse error', e);
      this.snackBar.open('Failed to parse error packet', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['error-snackbar'],
      });
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');

    this.sidebarService.collapseAll();

    this.router.navigate(['/dashboard']);
  }
}
