import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Variant,
  VariantResponse,
  VariantService,
} from 'src/app/core/services/variant.service';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  InspectionProgram,
  InspectionService,
} from 'src/app/core/services/inspection.service';
import { PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  distinctUntilChanged,
  switchMap,
  debounceTime,
  map,
  catchError,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-variant',
  imports: [
    FilterBarComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
    FormsModule,
  ],

  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.scss'],
  providers: [VariantService],
})
export class VariantComponent implements OnInit {
  lo1Image: any;
  variantList: any[] = [];
  form!: FormGroup;
  show = false;
  editMode = false;
  editId!: number;
  variantControl = new FormControl();
  allVariant: any[] = [];
  programControl = new FormControl();
  programList: any[] = [];
  selectedProgram: any = '';
  selectedVariant: any = '';
  selectedImage: File | null = null;
  previewUrl: string | null = null;
  selectedFile1: File;
  selectedFile2: File;
  previousImageFile1: File;
  previousImageFile2: File;
  searchText: string = '';
  showLo2 = false;
  image1: any;
  image2: any;
  paginationDtls = {
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    variantName: '',
  };
  existingImages: any = {
    main: '',
    lo2: '',
  };

  selectedFiles: any = {
    main: null,
    lo2: null,
  };
  sanitizer: any;
  constructor(
    private service: VariantService,
    private fb: FormBuilder,
    private inspectionService: InspectionService,
    private snackBar: MatSnackBar,
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
      variantCode: [''],
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
      //selectedProgram: [''],
      //selectedVariant: ['']
    });

    this.form.get('varientType')!.valueChanges.subscribe((value) => {
      this.showLo2 = value === 'Oscillator';

      if (!this.showLo2) {
        // Reset LO2 value when hidden
        this.form.get('lo2')!.reset();
      }
    });

    this.form.get('programId')?.disable();
    this.form.get('variantCode')?.disable();
    console.log('Variant Type:', this.form.get('varientType')?.value);
    this.form
      .get('variantName')!
      .valueChanges.pipe(
        debounceTime(300), // wait for user to stop typing
        distinctUntilChanged(), // only call API if value changes
        switchMap((value: string) =>
          this.service.getSupportedVariants(1, 10, value),
        ),
      )
      .subscribe((res: any) => {
        this.allVariant = res?.supportedVariantCodes || [];
      });

    this.form.get('variantName')!.valueChanges.subscribe((enteredValue) => {
      const selected = this.allVariant.find(
        (v) => v.variantName === enteredValue,
      );
      if (selected) {
        this.form.get('variantCode')!.setValue(selected.variantCode);
      } else {
        this.form.get('variantCode')!.reset();
      }
    });

    this.form
      .get('programNumber')!
      .valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((value: number) =>
          this.inspectionService.getSupportedPrograms(1, 10, value),
        ),
      )
      .subscribe((res: any) => {
        this.programList = res.listOfPrograms || [];

        const enteredValue = this.form.get('programNumber')!.value;
        const selected = this.programList.find(
          (p) => p.programNumber == enteredValue,
        );

        if (selected) {
          this.form.get('programId')!.setValue(selected.programId);
        } else {
          this.form.get('programId')!.reset();
        }
      });
  }
  onSearch() {
    this.paginationDtls.pageNumber = 1;
    this.paginationDtls.variantName = this.searchText.trim();
    this.loadData();
  }

  onPageChange(event: PageEvent) {
    this.paginationDtls.pageNumber = event.pageIndex + 1;
    this.paginationDtls.pageSize = event.pageSize;
    this.loadData();
  }

  loadData() {
    const { pageNumber, pageSize, variantName } = this.paginationDtls;
    this.service
      .getVariants(pageNumber, pageSize, variantName)
      .subscribe((res: VariantResponse) => {
        this.variantList = res?.variantList;
        this.paginationDtls.totalElements =
          res.paginationDtls?.totalElements || 0;
      });
  }

  getProgramData(num: number) {
    this.inspectionService
      .getAllInspectionPrograms(1, 10, num)
      .subscribe((res: any) => {
        this.programList = res.listOfPrograms;
      });
  }
  getSupportedVariants(variantName: string) {
    this.service
      .getSupportedVariants(1, 10, variantName)
      .subscribe((res: any) => {
        this.allVariant = res?.supportedVariantCodes || [];
      });
  }
  showForm() {
    this.form.reset();
    this.image1 = null;
    this.image2 = null;
    this.editMode = false;

    if (!this.editMode) {
      this.form.get('programNumber')?.enable();
      this.form.get('variantName')?.enable();
    }
    this.show = true;
  }

  close() {
    this.show = false;
  }
  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: any, type: 'main' | 'lo2') {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const previewUrl = e.target.result; // base64 preview

      if (type === 'main') {
        this.image1 = previewUrl; // override old image1 preview
        this.selectedFile1 = file;
      } else if (type === 'lo2') {
        this.image2 = previewUrl; // override old image2 preview
        this.selectedFile2 = file;
      }
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    const formValue = this.form.getRawValue();
    console.log('Form Value:', formValue);
    const variantMasterData = {
      variantName: formValue.variantName || null, // optional
      commonName: formValue.commonName,
      coilCode: formValue.coilCode,
      minimumSheetThickness: Number(formValue.minimumSheetThickness),
      maximumSheetThickness: Number(formValue.maximumSheetThickness),
      nominalSheetThickness: Number(formValue.nominalSheetThickness),
      thicknessUnit: formValue.thicknessUnit,
      variantCode: formValue.variantCode,
      partDescription: formValue.partDescription || null, // optional
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

    if (this.selectedFile1) {
      formData.append('recipeProfile1', this.selectedFile1);
    } else {
      formData.append('recipeProfile1', this.previousImageFile1);
    }

    if (this.selectedFile2 && this.showLo2) {
      formData.append('recipeProfile2', this.selectedFile2);
    } else if (this.showLo2) {
      formData.append('recipeProfile2', this.previousImageFile2);
    }

    if (this.editMode) {
      const updatedData = { id: this.editId, ...variantMasterData };
      formData.append('variantMasterData', JSON.stringify(updatedData));
      this.service.updateVariant(formData).subscribe(() => {
        this.showSnackbar('Record updated successfully');
        this.loadData();
        this.close();
      });
    } else {
      formData.append('variantMasterData', JSON.stringify(variantMasterData));
      this.service.createVariant(formData).subscribe(() => {
        this.showSnackbar('Record created successfully');
        this.loadData();
        this.close();
      });
    }
  }
  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  getImageSrc(variantCode: any, indexNo: any): void {
    this.service.getImagedetailsDataService(variantCode, indexNo).subscribe({
      next: (blob: Blob) => {
        const imageUrl = URL.createObjectURL(blob);
        console.log(`LO${indexNo} Image URL:`, imageUrl);
        // Convert Blob → File (since backend does NOT send filename, use fallback)
        const fallbackName = `image_${variantCode}_${indexNo}.png`;
        const file = new File([blob], fallbackName, { type: blob.type });
        // Assign to correct image variable
        if (indexNo === 1) {
          this.image1 = imageUrl;
          this.previousImageFile1 = file;
        } else if (indexNo === 2) {
          this.image2 = imageUrl;
          this.previousImageFile2 = file;
        }
      },

      error: (err) => {
        console.error(`Error loading LO${indexNo} image:`, err);
      },
    });
  }

  edit(item: any) {
    console.log('Editing item:', item);
    console.log('Variant code in edit:', item.id);
    this.getImageSrc(item.id, 1);
    if (item.varientType === 'Oscillator') {
      this.getImageSrc(item.id, 2);
    }
    this.form.setValue({
      variantName: item.variantName,
      commonName: item.commonName,
      programNumber: item.programDto.programNumber,
      programId: item.programDto.programId,
      coilCode: item.coilCode,
      minimumSheetThickness: item.minimumSheetThickness,
      maximumSheetThickness: item.maximumSheetThickness,
      nominalSheetThickness: item.nominalSheetThickness,
      thicknessUnit: item.thicknessUnit,
      variantCode: item.variantCode,
      partDescription: item.partDescription,
      output1Description: item.output1Description,
      feedLength: item.feedLength,
      feedLengthUnit: item.feedLengthUnit,
      widthNominal: item.widthNominal,
      widthUnit: item.widthUnit,
      lo1: item.lo1,
      lo2: item.lo2,
      varientType: item.varientType,
      depthOffset: item.depthOffset,
    });
    this.editId = item.id;
    this.editMode = true;
    this.show = true;
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.service.deleteVariant(id).subscribe(() => {
        this.showSnackbar('Record deleted successfully');
        this.loadData();
      });
    }
  }

  showSnackbar(message: string, panelClass: string = 'success-snackbar') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass],
    });
  }
}
