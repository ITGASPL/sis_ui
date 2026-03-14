import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
} from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
//import { Recipe, RecipesService } from '../recipes.service';
import {
  InspectionProgram,
  InspectionService,
} from 'src/app/core/services/inspection.service';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { ModelService } from 'src/app/core/services/model.service';
import { EquipmentService } from 'src/app/core/services/equipment.service';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: true,
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FilterBarComponent,
    FormsModule,
  ],
  providers: [InspectionService, EquipmentService],
})
export class RecipesComponent implements OnInit {
  recipeList: InspectionProgram[] = [];
  modelList: any[] = [];
  equipmentName: any[] = [];
  equipmentList: any[] = [];
  selectedEquipment: any = '';
  selectedModel: any = '';
  form!: FormGroup;
  cameras: any[] = [];

  show = false;
  editMode = false;
  editId!: number;
  showVariants = false;
  variantList: any[] = [];
  searchText: string = '';

  paginationDtls = {
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    programNumber: '',
  };

  constructor(
    private service: InspectionService,
    private fb: FormBuilder,
    private modelService: ModelService,
    private equipmentService: EquipmentService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadModeldata();
    this.loadEquipmentData();
    this.getActiveCameras();

    this.form = this.fb.group({
      programNumber: [''],
      equipmentName: [null],
      equipmentId: [''],
      modelName: [null],
      modelId: [''],
      cameraCount: new FormControl({ value: 0, disabled: true }), // disabled input
      cameraList: this.fb.array([]), // ✅ initialize FormArray here
    });
    this.form.get('equipmentId')?.disable();
    this.form.get('modelId')?.disable();
    this.form
      .get('equipmentName')!
      .valueChanges.subscribe((selectedEquipment) => {
        if (selectedEquipment) {
          this.form.get('equipmentId')!.setValue(selectedEquipment.id);
        } else {
          this.form.get('equipmentId')!.reset();
        }
      });

    this.form.get('modelName')!.valueChanges.subscribe((selectedModel) => {
      if (selectedModel) {
        this.form.get('modelId')!.setValue(selectedModel.id);
      } else {
        this.form.get('modelId')!.reset();
      }
    });
  }
  showMinimalForm: boolean = false;

  get cameraList(): FormArray {
    return this.form.get('cameraList') as FormArray;
  }

  isCameraSelected(cam: any): boolean {
    return this.cameraList.value.some((c: any) => c.cameraId === cam.cameraId);
  }
  onSearch() {
    this.paginationDtls.pageNumber = 1;
    this.paginationDtls.programNumber = this.searchText.trim();
    this.loadData();
  }

  onPageChange(event: PageEvent) {
    this.paginationDtls.pageNumber = event.pageIndex + 1;
    this.paginationDtls.pageSize = event.pageSize;
    this.loadData();
  }
  getActiveCameras() {
    this.service.getActiveCameras().subscribe((res: any) => {
      this.cameras = res.cameraList || [];
    });
  }

  loadData() {
    const { pageNumber, pageSize, programNumber } = this.paginationDtls;
    this.service
      .getAllInspectionPrograms(
        pageNumber,
        pageSize,
        programNumber ? Number(programNumber) : undefined,
      )
      .subscribe((res) => {
        this.recipeList = res.listOfPrograms;
        this.paginationDtls.totalElements =
          res.paginationDtls?.totalElements || 0;
      });
  }
  loadModeldata() {
    this.modelService
      .getModels(1, 10, '')
      .subscribe(
        (res) => (
          (this.modelList = res.listOfModels ? res.listOfModels : []),
          (this.equipmentName = res.listOfModels ? res.listOfModels : [])
        ),
      );
  }

  loadEquipmentData() {
    this.equipmentService
      .getAllEquipment(1, 10, '')
      .subscribe(
        (res: any) =>
          (this.equipmentList = res.equipmentList ? res.equipmentList : []),
      );
  }

  showForm() {
    this.form.reset();
    this.editMode = false;
    this.cameraList.clear();

    this.show = true;
    this.showMinimalForm = true;

    if (!this.editMode) {
      this.form.get('programNumber')?.enable();
    }
  }
  closeVariant() {
    this.showVariants = false;
  }
  close() {
    this.show = false;
  }
  toggleVariant(r: any) {
    this.showVariants = true;
    this.variantList = r.listOfVarients;
  }
  onSubmit() {
    const formData = this.form.getRawValue();
    const selectedCameras: number[] = this.form.value.cameraList;

    const cameraObjects = this.cameraList.value.map((c: any) => ({
      cameraId: c.cameraId,
      cameraNumber: c.cameraNumber,
      mappingId: c.mappingId ?? null,
    }));

    if (this.editMode) {
      const { modelName, equipmentName, ...filteredData } = formData;
      const updatedData = {
        programId: this.editId,
        cameraList: cameraObjects,
        ...filteredData,
      };

      this.service.updateInspectionProgram(updatedData).subscribe(() => {
        this.showSnackbar('Record updated successfully');
        this.loadData();
        this.close();
      });
    } else {
      const { modelName, equipmentName, cameraList, ...filteredData } =
        formData;
      const newData = {
        ...filteredData,
        cameraList: cameraObjects,
      };

      this.service.createInspectionProgram(newData).subscribe(() => {
        this.showSnackbar('Record created successfully');
        this.loadData();
        this.close();
      });
    }
  }

  edit(recipe: any) {
    console.log('Editing Recipe:', recipe);
    const selectedEquipmentName = this.equipmentList.find(
      (proge: any) => proge.equipmentName === recipe.equipmentName,
    );
    const selectedModelName = this.modelList.find(
      (progm: any) => progm.modelName === recipe.model,
    );

    this.form.patchValue({
      modelName: selectedModelName ? selectedModelName : '',
      equipmentName: selectedEquipmentName ? selectedEquipmentName : '',
      programNumber: recipe.programNumber,
      equipmentId: recipe.equipmentId,
      modelId: recipe.modelId,
      cameraCount: recipe.cameraCount,
    });

    this.cameraList.clear();
    recipe.cameraList.forEach((cam: any) => {
      this.cameraList.push(this.fb.control(cam));
    });
    this.editId = recipe.programId;
    this.editMode = true;
    this.show = true;
    this.form.get('programNumber')?.disable();
  }
  showSnackbar(message: string, panelClass: string = 'success-snackbar') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass],
    });
  }
  onCheckboxChange(event: any, cam: any) {
    if (event.target.checked) {
      this.cameraList.push(this.fb.control(cam));
    } else {
      const index = this.cameraList.controls.findIndex(
        (x) => x.value.cameraId === cam.cameraId,
      );
      if (index >= 0) {
        this.cameraList.removeAt(index);
      }
    }
    this.form.get('cameraCount')?.setValue(this.cameraList.length);
  }
}
