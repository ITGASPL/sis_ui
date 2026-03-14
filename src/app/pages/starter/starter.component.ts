import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { AppSalesOverviewComponent } from 'src/app/shared/components/sales-overview/sales-overview.component';
import { AppDailyActivitiesComponent } from 'src/app/shared/components/daily-activities/daily-activities.component';
import { AppProductPerformanceComponent } from 'src/app/shared/components/product-performance/product-performance.component';
import { AppBlogComponent } from 'src/app/shared/components/apps-blog/apps-blog.component';

@Component({
  selector: 'app-starter',
  imports: [
    MaterialModule,
    AppSalesOverviewComponent,
    AppDailyActivitiesComponent,
    AppProductPerformanceComponent,
    AppBlogComponent,
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent {}
