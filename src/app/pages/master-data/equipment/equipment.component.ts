import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatLineModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Equipment, EquipmentService } from 'src/app/core/services/equipment.service';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatLineModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    FilterBarComponent,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule
  ],
  providers: [EquipmentService]
})
export class EquipmentComponent implements OnInit {

  equipmentList: any;

  form!: FormGroup;
  show = false;
  editMode = false;
  editId!: number | undefined;

  searchText: string = '';

  paginationDtls = {
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    equipmentName: ''
  };

  constructor(
    private service: EquipmentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.form = this.fb.group({
      line: [''],
      equipmentName: [''],
      equipmentGroup: [''],
    });
  }

  // 🔍 Search
  onSearch() {
    this.paginationDtls.pageNumber = 1;
    this.paginationDtls.equipmentName = this.searchText.trim();
    this.loadData();
  }

  // 📄 Pagination
  onPageChange(event: PageEvent) {
    this.paginationDtls.pageNumber = event.pageIndex + 1;
    this.paginationDtls.pageSize = event.pageSize;
    this.loadData();
  }

  // 📥 Load Data
  loadData() {
    const { pageNumber, pageSize, equipmentName } = this.paginationDtls;

    this.service.getAllEquipment(pageNumber, pageSize, equipmentName ? equipmentName : '')
      .subscribe((res) => {
        this.equipmentList = res.equipmentList || [];
        this.paginationDtls.totalElements = res.paginationDtls?.totalElements || 0;
      });
  }

  // ➕ Show Form
  showForm() {
    this.form.reset();
    this.editMode = false;
    this.show = true;
  }

  // ❌ Close Form
  close() {
    this.show = false;
  }

  // 💾 Submit
  onSubmit() {
    const formData = this.form.value;

    if (this.editMode) {
      const updatedData = { id: this.editId, ...formData };

      this.service.updateEquipment(updatedData).subscribe(() => {
        this.showSnackbar('Record updated successfully', 'update-snackbar');
        this.loadData();
        this.close();
      });

    } else {
      this.service.createEquipment(formData).subscribe(() => {
        this.showSnackbar('Record created successfully', 'success-snackbar');
        this.loadData();
        this.close();
      });
    }
  }

  // ✏️ Edit
  edit(eq: Equipment) {
    this.form.setValue({
      line: eq.line,
      equipmentName: eq.equipmentName,
      equipmentGroup: eq.equipmentGroup,
    });

    this.editId = eq.id;
    this.editMode = true;
    this.show = true;
  }

  // 🗑️ Delete
  delete(id: number) {
    if (confirm('Are you sure want to delete this record ?')) {
      this.service.deleteEquipment(id).subscribe(() => {
        this.showSnackbar('Record deleted successfully', 'delete-snackbar');
        this.loadData();
      });
    }
  }

  // 🔔 Snackbar (Reusable)
  showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass]
    });
  }

}