import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngStyle]="data.styles" style="padding: 12px; border-radius: 6px;">
      {{ data.message }}
    </div>
  `,
})
export class CustomSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
