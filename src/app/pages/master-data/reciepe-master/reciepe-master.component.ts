import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-reciepe-master',
  imports: [
    RouterModule,
    MatListModule,
    MatCardModule,

    MatIconModule,
    MaterialModule,
    FilterBarComponent,
  ],
  templateUrl: './reciepe-master.component.html',
  styleUrl: './reciepe-master.component.scss',
})
export class ReciepeMasterComponent {
  isSpinning = false;
  startSpin() {
    this.isSpinning = true;
    setTimeout(() => {
      this.isSpinning = false;
    }, 1000);
  }
}
