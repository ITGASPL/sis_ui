// quality-punching.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // For routing (if needed)
import { MaterialModule } from 'src/app/material.module'; // Your shared MaterialModule (if any)
import { QualityPunchingComponent } from 'src/app/pages/quality-punching/quality-punching.component'; // Import the QualityPunchingComponent

// Import Angular Material modules as required
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar'; // Import MatToolbarModule here
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@NgModule({
  // declarations: [QualityPunchingComponent],  // Declare your component here
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    DatePipe,
    QualityPunchingComponent,
  ],
  exports: [QualityPunchingComponent],
})
export class QualityPunchingModule {}
