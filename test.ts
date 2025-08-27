// In your module.ts file, make sure you have:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkforceSupplyWidgetComponent } from './workforce-supply-widget.component';

@NgModule({
  declarations: [
    WorkforceSupplyWidgetComponent
  ],
  imports: [
    CommonModule
    // Your HighCharts service should already be included as you mentioned
  ],
  exports: [
    WorkforceSupplyWidgetComponent
  ]
})
export class WorkforceWidgetModule { }

// Usage in your parent component:
/*
<app-workforce-supply-widget></app-workforce-supply-widget>
*/

// If you need to pass data dynamically, you can modify the component to accept inputs:
/*
@Input() workforceData: any = {
  total: 148,
  fcvPercentage: 30,
  nonFcvPercentage: 70,
  fcvCount: 44,
  nonFcvCount: 104
};
*/