import { Component, OnInit } from '@angular/core';
import { Model, ModelService } from 'src/app/core/services/model.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { MatLineModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-model',
  imports: [
    FilterBarComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    MatLineModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    // Remove MatSnackBarModule from here
  ],
  templateUrl: './model.component.html',
  styleUrl: './model.component.scss',
  providers: [ModelService],
})
export class ModelComponent implements OnInit {
  modelList: any[] = [];
  form!: FormGroup;
  show = false;
  editMode = false;
  editId!: number | undefined;
  searchText: string = '';

  paginationDtls = {
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    modelName: '',
  };

  constructor(
    private service: ModelService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      modelName: [''],
      description: [''],
    });

    this.loadData(); // Load first time with empty search
  }

  loadData() {
    const { pageNumber, pageSize, modelName } = this.paginationDtls;

    this.service
      .getModels(pageNumber, pageSize, modelName ? modelName : '')
      .subscribe((res) => {
        this.modelList = res.listOfModels ?? [];
        this.paginationDtls.totalElements =
          res.paginationDtls?.totalElements || 0;
      });
  }

  onSearch() {
    this.paginationDtls.pageNumber = 1;
    this.paginationDtls.modelName = this.searchText.trim();
    this.loadData();
  }

  onPageChange(event: PageEvent) {
    this.paginationDtls.pageNumber = event.pageIndex + 1;
    this.paginationDtls.pageSize = event.pageSize;
    this.loadData();
  }

  showForm() {
    this.form.reset();
    this.editMode = false;
    this.show = true;
  }

  close() {
    this.show = false;
  }

  onSubmit() {
    const formData = this.form.value;

    if (this.editMode) {
      const updatedData = { id: this.editId, ...formData };
      this.service.updateModel(updatedData).subscribe(() => {
        this.showSnackbar('Record updated successfully');
        this.loadData();
        this.close();
      });
    } else {
      this.service.createModel(formData).subscribe(() => {
        this.showSnackbar('Record created successfully');
        this.loadData();
        this.close();
      });
    }
  }

  edit(item: Model) {
    this.form.setValue({
      modelName: item.modelName,
      description: item.description,
    });
    this.editId = item.id;
    this.editMode = true;
    this.show = true;
  }
  showSnackbar(message: string, panelClass: string = 'success-snackbar') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass],
    });
  }

  deleteModel(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.service.deleteModel(id).subscribe(() => {
        this.showSnackbar('Record deleted successfully');
        this.loadData();
      });
    }
  }
}
