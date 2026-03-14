import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  NgModule,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatLineModule } from '@angular/material/core';
import {
  MachineLiveStatus,
  MachineLiveStatusService,
} from 'src/app/core/services/machine-live-status.service';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-mchine-live-status',
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule,
    MatCardModule,
    CommonModule,
    MatListModule,
    MatIconModule,
    MatLineModule,
  ],
  providers: [],
  templateUrl: './machine-live-status.component.html',
  styleUrl: './machine-live-status.component.scss',
})
export class MachineLiveStatusComponent implements OnInit, OnDestroy {
  liveStatus: any;
  isSpinning = false;
  machineStateFetchTime: Date = new Date();

  isDayView: boolean;
  @Input() showToggle = true;
  @Input() isChecked = false;
  @Output() toggleChanged = new EventEmitter<Event>();
  private refreshMachineStatus!: Subscription;
  constructor(private statusService: MachineLiveStatusService) {}

  ngOnInit(): void {
    this.getMachineStatus();
    this.startAutoRefresh();
  }
  ngOnDestroy(): void {
    if (this.refreshMachineStatus) {
      this.refreshMachineStatus.unsubscribe();
    }
  }
  getMachineStatus() {
    this.isSpinning = true;
    this.machineStateFetchTime = new Date();
    this.statusService.getLiveStatus(1).subscribe({
      next: (data) => {
        this.liveStatus = data.machineStatus;

        this.isSpinning = false;
      },
      error: (err) => {
        console.error('Error fetching machine status:', err);
        this.isSpinning = false;
      },
    });
  }

  onToggle(event: Event): void {
    this.toggleChanged.emit(event);
  }
  startAutoRefresh(): void {
    this.refreshMachineStatus = interval(5000).subscribe(() => {
      this.getMachineStatus();
    });
  }
}
