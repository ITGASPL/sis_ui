import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
})
export class FilterBarComponent {
  lastUpdated = '09/04/2025 11:30 AM';

  sites = ['SMG', 'XYZ'];
  locations = ['Gujrat', 'Delhi'];
  plants = ['PLT-A', 'PLT-B'];
  shops = ['Press-Shop', 'Assembly'];

  selectedSite = this.sites[0];
  selectedLocation = this.locations[0];
  selectedPlant = this.plants[0];
  selectedShop = this.shops[0];
}
