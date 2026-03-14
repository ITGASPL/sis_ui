import { Component, OnInit } from '@angular/core';
import { BreaksService, BreakData } from '../breaks.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterBarComponent } from 'src/app/shared/components/filter-bar/filter-bar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-breaks',
  imports: [
    FilterBarComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
  ],
  templateUrl: './breaks.component.html',
  styleUrl: './breaks.component.scss',
  providers: [BreaksService],
})
export class BreaksComponent implements OnInit {
  breakList: BreakData[] = [];
  form!: FormGroup;
  show = false;
  editMode = false;
  editId!: number;

  constructor(
    private service: BreaksService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.form = this.fb.group({
      start: [''],
      end: [''],
    });
  }

  loadData() {
    this.service.getAll().subscribe((res) => (this.breakList = res));
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
      const updated = { id: this.editId, ...formData };
      this.service.update(this.editId, updated).subscribe(() => {
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

  edit(item: BreakData) {
    this.form.setValue({
      start: item.start,
      end: item.end,
    });
    this.editId = item.id;
    this.editMode = true;
    this.show = true;
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }
}
