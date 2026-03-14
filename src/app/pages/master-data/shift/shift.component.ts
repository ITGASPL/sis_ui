import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShiftData, ShiftService } from '../shift.service';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-shift',
  standalone: true,
  imports: [FilterBarComponent,CommonModule, ReactiveFormsModule, RouterModule,
    MatPaginatorModule
  ],
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.scss'],
  providers: [ShiftService]
})
export class ShiftComponent implements OnInit {
  shiftList: ShiftData[] = [];
  form!: FormGroup;
  show = false;
  editMode = false;
  editId!: number;

  constructor(private service: ShiftService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadData();
    this.form = this.fb.group({
      shift: [''],
      start: [''],
      end: ['']
    });
  }

  loadData() {
    this.service.getAll().subscribe(res => this.shiftList = res);
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
      this.service.update(this.editId, updatedData).subscribe(() => {
        this.loadData();
        this.close();
      });
    } else {
      this.service.add(formData).subscribe(() => {
        this.loadData();
        this.close();
      });
    }
  }

  edit(item: ShiftData) {
    this.form.setValue({
      shift: item.shift,
      start: item.start,
      end: item.end
    });
    this.editId = item.id;
    this.editMode = true;
    this.show = true;
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this shift?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }
}
