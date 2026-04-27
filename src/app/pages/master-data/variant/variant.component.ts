import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  VariantResponse,
  VariantService,
} from 'src/app/core/services/variant.service';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { InspectionService } from 'src/app/core/services/inspection.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
} from 'rxjs/operators';

@Component({
  selector: 'app-variant',
  standalone: true,
  imports: [
    FilterBarComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
    FormsModule,
    MatSnackBarModule   // ✅ IMPORTANT
  ],
  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.scss'],
  providers: [VariantService],
})
export class VariantComponent implements OnInit {

  variantList: any[] = [];
  form!: FormGroup;

  show = false;
  editMode = false;
  editId!: number;

  searchText: string = '';
  showLo2 = false;

  allVariant: any[] = [];
  programList: any[] = [];

  selectedFile1!: File;
  selectedFile2!: File;

  image1: any;
  image2: any;

  paginationDtls = {
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    variantName: '',
  };

  constructor(
    private service: VariantService,
    private fb: FormBuilder,
    private inspectionService: InspectionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.form = this.fb.group({
      programNumber: [''],
      programId: [''],
      variantName: [''],
      commonName: [''],
      coilCode: [''],
      minimumSheetThickness: [''],
      maximumSheetThickness: [''],
      nominalSheetThickness: [''],
      thicknessUnit: [''],
      variantCode: [{ value: '', disabled: true }],
      partDescription: [''],
      output1Description: [''],
      feedLength: [''],
      feedLengthUnit: [''],
      widthNominal: [''],
      widthUnit: [''],
      varientType: [''],
      lo1: [''],
      lo2: [''],
      depthOffset: [''],
    });

    // 🔁 Toggle LO2
    this.form.get('varientType')!.valueChanges.subscribe((value) => {
      this.showLo2 = value === 'Oscillator';
      if (!this.showLo2) {
        this.form.get('lo2')!.reset();
      }
    });

    this.form.get('programId')?.disable();
    this.form.get('variantCode')?.disable();

    // 🔍 Variant search
    this.form.get('variantName')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: string) =>
        this.service.getSupportedVariants(1, 10, value)
      )
    ).subscribe((res: any) => {
      this.allVariant = res?.supportedVariantCodes || [];
    });

    this.form.get('variantName')!.valueChanges.subscribe((value) => {
      const selected = this.allVariant.find(v => v.variantName === value);
      this.form.get('variantCode')!.setValue(
        selected ? selected.variantCode : ''
      );
    });

    // 🔥 FIXED programNumber block
    this.form.get('programNumber')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: number) =>
        this.inspectionService.getSupportedPrograms(1, 10, value).pipe(
          map(res => ({ res, value }))
        )
      )
    ).subscribe(({ res, value }) => {

      this.programList = res.listOfPrograms || [];

      const selected = this.programList.find(
        (p) => p.programNumber == value
      );

      this.form.get('programId')!.setValue(
        selected ? selected.programId : ''
      );
    });
  }

  // 🔍 Search
  onSearch() {
    this.paginationDtls.pageNumber = 1;
    this.paginationDtls.variantName = this.searchText.trim();
    this.loadData();
  }

  // 📄 Pagination
  onPageChange(event: PageEvent) {
    this.paginationDtls.pageNumber = event.pageIndex + 1;
    this.paginationDtls.pageSize = event.pageSize;
    this.loadData();
  }

  // 📥 Load data
  loadData() {
    const { pageNumber, pageSize, variantName } = this.paginationDtls;

    this.service.getVariants(pageNumber, pageSize, variantName)
      .subscribe((res: VariantResponse) => {
        this.variantList = res?.variantList || [];
        this.paginationDtls.totalElements =
          res.paginationDtls?.totalElements || 0;
      });
  }

  // ➕ Show form
  showForm() {
    this.form.reset();
    this.image1 = null;
    this.image2 = null;
    this.editMode = false;
    this.show = true;
  }

  close() {
    this.show = false;
  }

  // 📁 File select
  onFileSelected(event: any, type: 'main' | 'lo2') {
    console.log('FILE SELECTED EVENT TRIGGERED');
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => { 
       console.log('IMAGE DATA:', e.target.result);
      if (type === 'main') {
        this.image1 = e.target.result;
        this.selectedFile1 = file;
      } else {
        this.image2 = e.target.result;
        this.selectedFile2 = file;
      }
    };

    reader.readAsDataURL(file);
  }

  // 💾 Submit
  onSubmit() {
    const formValue = this.form.getRawValue();

    const data = {
      variantName: formValue.variantName,
      commonName: formValue.commonName,
      coilCode: formValue.coilCode,
      minimumSheetThickness: Number(formValue.minimumSheetThickness),
      maximumSheetThickness: Number(formValue.maximumSheetThickness),
      nominalSheetThickness: Number(formValue.nominalSheetThickness),
      thicknessUnit: formValue.thicknessUnit,
      variantCode: formValue.variantCode,
      partDescription: formValue.partDescription,
      output1Description: formValue.output1Description,
      feedLength: Number(formValue.feedLength),
      feedLengthUnit: formValue.feedLengthUnit,
      widthNominal: Number(formValue.widthNominal),
      widthUnit: formValue.widthUnit,
      varientType: formValue.varientType,
      lo1: Number(formValue.lo1) || 0,
      lo2: Number(formValue.lo2) || 0,
      depthOffset: Number(formValue.depthOffset) || 0,
      programDto: {
        programId: Number(formValue.programId),
      },
    };

    const formData = new FormData();
    formData.append('variantMasterData', JSON.stringify(data));

    if (this.selectedFile1) {
      formData.append('recipeProfile1', this.selectedFile1);
    }

    if (this.selectedFile2 && this.showLo2) {
      formData.append('recipeProfile2', this.selectedFile2);
    }

    if (this.editMode) {
      this.service.updateVariant(formData).subscribe({
        next: () => {
          this.showSnackbar('Record updated successfully', 'update-snackbar');
          this.loadData();
          this.close();
        },
        error: () => {
          this.showSnackbar('Update failed', 'delete-snackbar');
        }
      });
    } else {
      this.service.createVariant(formData).subscribe({
        next: () => {
          this.showSnackbar('Record created successfully', 'success-snackbar');
          this.loadData();
          this.close();
        },
        error: () => {
          this.showSnackbar('Creation failed', 'delete-snackbar');
        }
      });
    }
  }


  // ✏️ Edit
  edit(item: any) {
    this.form.patchValue(item);
    this.editId = item.id;
    this.editMode = true;
    this.show = true;
    this.loadImages(item.id);
  }
  loadImages(id: number) {

  // 🔹 IMAGE 1 (index = 1)
  this.service.getImagedetailsDataService(id.toString(), '1')
    .subscribe({
      next: (blob: Blob) => {
        this.image1 = URL.createObjectURL(blob);
      },
      error: () => {
        this.image1 = null;
      }
    });

  // 🔹 IMAGE 2 (index = 2)
  this.service.getImagedetailsDataService(id.toString(), '2')
    .subscribe({
      next: (blob: Blob) => {
        this.image2 = URL.createObjectURL(blob);
      },
      error: () => {
        this.image2 = null;
      }
    });
}

  // 🗑️ Delete
  delete(id: number) {
    if (confirm('Are you sure?')) {
      this.service.deleteVariant(id).subscribe({
        next: () => {
          this.showSnackbar('Record deleted successfully', 'delete-snackbar');
          this.loadData();
        },
        error: () => {
          this.showSnackbar('Delete failed', 'delete-snackbar');
        }
      });
    }
  }

  // 🔔 Snackbar
  showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass],
    });
  }
}