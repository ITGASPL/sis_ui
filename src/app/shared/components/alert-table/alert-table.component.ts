import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { AlertService } from 'src/app/core/services/alert.service';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  Variant,
  VariantResponse,
  VariantService,
} from 'src/app/core/services/variant.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import {
  InspectionProgram,
  InspectionService,
} from 'src/app/core/services/inspection.service';

@Component({
  selector: 'app-alert-table',
  imports: [
    MatDialogModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatPaginator,
    MatOptionModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
  ],
  templateUrl: './alert-table.component.html',
  styleUrls: ['./alert-table.component.scss'],
})
export class AlertTableComponent implements OnInit {
  searchSheetNumber = '';
  searchVariantCode = '';
  searchProgramNumber = '';
  searchSeverity = '';
  startDate: string = '';
  endDate: string = '';
  dateError: string = '';
  variantCtrl: FormControl = new FormControl('');
  programCtrl: FormControl = new FormControl('');
  allVariant: Variant[] = [];
  allProgram: InspectionProgram[] = [];
  // Date models for Material datepicker
  startDateModel: Date | null = null;
  endDateModel: Date | null = null;
  constructor(
    private alertService: AlertService,
    private service: VariantService,
    private inspectionService: InspectionService,
  ) {}
  alertList: any[] = [];
  paginationDtls = {
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
  };
  today = new Date();
  selectedSeverity: string = '';
  severityOptions = ['CRITICAL', 'MAJOR', 'MINOR'];
  //displayedColumns: string[] = ['id','alert_code','severity','sheet_number','message', 'timestamp'];
  displayedColumns: string[] = [
    'Sheet Number',
    'Variant Code',
    'Program Number',
    'Timestamp',
    'Alert Code',
    'Severity',
    'Alert Message',
  ];
  data = [
    {
      sheetNumber: '2509190136_00589',
      variantCode: null,
      programNumber: null,
      createdTime: new Date(1758225969000),
      alertCode: 'VariantNotFound',
      severity: 'CRITICAL',
      description: 'Variant or program missing in tracker',
    },
    {
      sheetNumber: '2509190136_00590',
      variantCode: 'VC101',
      programNumber: 'PN1001',
      createdTime: new Date(1758226969000),
      alertCode: 'ServerRestarted',
      severity: 'MAJOR',
      description: 'Server restarted unexpectedly',
    },
    {
      sheetNumber: '2509190136_00591',
      variantCode: 'VC102',
      programNumber: 'PN1002',
      createdTime: new Date(1758227969000),
      alertCode: 'OrderReceived',
      severity: 'MINOR',
      description: 'New order received for processing',
    },
    {
      sheetNumber: '2509190136_00592',
      variantCode: 'VC103',
      programNumber: 'PN1003',
      createdTime: new Date(1758228969000),
      alertCode: 'ProfileUpdated',
      severity: 'OTHERS',
      description: 'Profile updated successfully',
    },
    {
      sheetNumber: '2509190136_00593',
      variantCode: null,
      programNumber: null,
      createdTime: new Date(1758229969000),
      alertCode: 'VariantNotFound',
      severity: 'CRITICAL',
      description: 'Variant or program missing in tracker',
    },
    {
      sheetNumber: '2509190136_00594',
      variantCode: 'VC104',
      programNumber: 'PN1004',
      createdTime: new Date(1758230969000),
      alertCode: 'ServerRestarted',
      severity: 'WARNING',
      description: 'Server restarted during operation',
    },
    {
      sheetNumber: '2509190136_00595',
      variantCode: 'VC105',
      programNumber: 'PN1005',
      createdTime: new Date(1758231969000),
      alertCode: 'OrderReceived',
      severity: 'INFO',
      description: 'Order received for production batch',
    },
    {
      sheetNumber: '2509190136_00596',
      variantCode: 'VC106',
      programNumber: 'PN1006',
      createdTime: new Date(1758232969000),
      alertCode: 'ProfileUpdated',
      severity: 'SUCCESS',
      description: 'Profile updated for variant VC106',
    },
    {
      sheetNumber: '2509190136_00597',
      variantCode: null,
      programNumber: null,
      createdTime: new Date(1758233969000),
      alertCode: 'VariantNotFound',
      severity: 'CRITICAL',
      description: 'No variant found in tracker for this sheet',
    },
    {
      sheetNumber: '2509190136_00598',
      variantCode: 'VC107',
      programNumber: 'PN1007',
      createdTime: new Date(1758234969000),
      alertCode: 'ServerRestarted',
      severity: 'WARNING',
      description: 'Server restarted after maintenance',
    },
  ];

  validateDateRange(): void {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const today = new Date();

    // Remove time part
    today.setHours(0, 0, 0, 0);

    if ((this.startDate && start > today) || (this.endDate && end > today)) {
      this.dateError = 'Date cannot be greater than today';
      return;
    }

    if (this.startDate && this.endDate && end < start) {
      this.dateError = 'End Date cannot be earlier than Start Date';
      return;
    }

    // ✅ If all good
    this.dateError = '';
    this.onSearch();
  }

  ngOnInit() {
    this.loadData();

    // Variant autocomplete: call API as user types, debounce 300ms
    this.variantCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value: string | null) =>
          this.service.getVariants(1, 10, value || ''),
        ),
      )
      .subscribe((res: VariantResponse) => {
        this.allVariant = res?.variantList || [];
      });

    this.programCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value1: number | null) =>
          this.inspectionService.getSupportedPrograms(
            1,
            10,
            value1 ?? undefined,
          ),
        ),
      )
      .subscribe((res: any) => {
        this.allProgram = res?.listOfPrograms || [];
      });
  }

  selectVariant(code: string) {
    // When user selects variant from autocomplete
    this.searchVariantCode = code;
    this.onSearch();
  }

  onVariantInput() {
    // Update searchVariantCode when user types
    this.searchVariantCode = this.variantCtrl.value || '';
    this.onSearch();
  }

  selectProgram(number: string) {
    // When user selects program from autocomplete
    this.searchProgramNumber = number;
    this.onSearch();
  }

  onProgramInput() {
    // Update searchProgramNumber when user types
    this.searchProgramNumber = this.programCtrl.value || '';
    this.onSearch();
  }

  onStartDateChange(event: any) {
    const d: Date | null = event?.value ?? null;
    if (d) {
      // store as yyyy-mm-dd string to keep existing logic
      this.startDate = d.toISOString().split('T')[0];
      this.startDateModel = d;
    } else {
      this.startDate = '';
      this.startDateModel = null;
    }
    this.validateDateRange();
  }

  onEndDateChange(event: any) {
    const d: Date | null = event?.value ?? null;
    if (d) {
      this.endDate = d.toISOString().split('T')[0];
      this.endDateModel = d;
    } else {
      this.endDate = '';
      this.endDateModel = null;
    }
    this.validateDateRange();
  }
  onPageChange(event: PageEvent) {
    this.paginationDtls.pageNumber = event.pageIndex + 1;
    this.paginationDtls.pageSize = event.pageSize;
    this.loadData();
  }
  loadData(alertFilter: {} = {}) {
    const { pageNumber, pageSize } = this.paginationDtls;
    this.alertService
      .getAllAlerts(pageNumber, pageSize, alertFilter)
      .subscribe((res) => {
        this.alertList = res.listOfAlerts || [];
        this.paginationDtls.totalElements =
          res.paginationDtls?.totalElements || 0;
      });
  }
  onSeverityChange(element: any) {}

  resetForm() {
    this.searchSheetNumber = '';
    this.variantCtrl.setValue('');
    this.programCtrl.setValue('');
    this.searchSeverity = '';
    this.startDate = '';
    this.endDate = '';
    this.startDateModel = null;
    this.endDateModel = null;
    this.dateError = '';
    this.loadData();
  }
  onSearch() {
    console.log('Search triggered:', {
      sheet: this.searchSheetNumber,
      variant: this.searchVariantCode,
      program: this.searchProgramNumber,
      severity: this.searchSeverity,
    });
  }
  submitForm() {
    // Combine all search values and submit
    const alertFilter = {
      sheetNumber: this.searchSheetNumber,
      variantCode: this.searchVariantCode,
      programNumber: this.searchProgramNumber,
      severity: this.searchSeverity,
      startDate: this.startDate,
      endDate: this.endDate,
      unreadOnly: false,
    };

    this.loadData(alertFilter);
  }
}
