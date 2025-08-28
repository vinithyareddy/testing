import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-swfp-by-country-job',
  templateUrl: './swfp-by-country-job.component.html',
  styleUrls: ['./swfp-by-country-job.component.scss']
})
export class SwfpByCountryJobComponent {
  ResponseFlag = true;   // simulate data load complete
  collapsed = false;
  fullview = false;

  // ✅ Dummy data (structured, no hardcoding in template)
  groupdata = [
    { country: 'United States', flag: 'us', fte: 96, expanded: false, jobs: [] },
    { country: 'India', flag: 'in', fte: 10, expanded: false, jobs: [] },
    { country: 'Nigeria', flag: 'ng', fte: 6, expanded: false, jobs: [] },
    { country: 'Bangladesh', flag: 'bd', fte: 5, expanded: false, jobs: [] },
    { country: 'Ethiopia', flag: 'et', fte: 5, expanded: false, jobs: [] },
    { country: 'Kenya', flag: 'ke', fte: 5, expanded: false, jobs: [] },
    { country: 'Pakistan', flag: 'pk', fte: 5, expanded: false, jobs: [] },
    { country: 'Senegal', flag: 'sn', fte: 4, expanded: false, jobs: [] }
  ];

  total = [
    { label: 'Total', fte: 239 }
  ];

  constructor(private render: Renderer2) {}

  expandRow(row: any) {
    row.expanded = !row.expanded;
  }

  expand() { this.collapsed = false; }
  collapse() { this.collapsed = true; }

  fullPageView() {
    this.fullview = !this.fullview;
    if (this.fullview) {
      this.render.addClass(document.body, 'no-scroll');
    } else {
      this.render.removeClass(document.body, 'no-scroll');
    }
  }

  getDetailPage() {
    console.log('Navigate → detail page');
  }
}


<div [ngClass]="{ 'full-view': fullview }">
  <div class="budget-card-box">
    <div class="budget-box-chart">
      <!-- Header -->
      <div class="row card-box-header-sec">
        <div class="card-box-header-sec col-md-9">
          <div class="widget-heading mt-1 cursorpointer">
            <span>Workforce Supply (FTE) by Country & Job
              <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
            </span>
          </div>
        </div>
        <div class="col-md-3 bgt-text-end d-flex justify-content-end align-items-center">
          <span (click)="fullPageView()" class="view">
            <i class="fas fa-expand" title="Zoom"></i>
          </span>
          <div class="ellipsis ml-2">
            <i class="fas fa-ellipsis-v"></i>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div [@collapse]="collapsed">
        <ng-container *ngIf="!ResponseFlag">
          <div class="loader-img">
            <lift-section-loader></lift-section-loader>
          </div>
        </ng-container>

        <ng-container *ngIf="ResponseFlag">
          <div class="TableView">
            <table class="table">
              <thead class="tableHeading">
                <tr>
                  <th class="text-left">Location and Job</th>
                  <th>FTE</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of groupdata">
                  <td class="pointer text-left" (click)="expandRow(row)">
                    <i *ngIf="!row.expanded" class="far fa-plus-circle"></i>
                    <i *ngIf="row.expanded" class="far fa-minus-circle"></i>
                    <img [src]="'https://flagcdn.com/16x12/' + row.flag + '.png'" class="flag-icon"/>
                    &nbsp;{{ row.country }}
                  </td>
                  <td>{{ row.fte }}</td>
                </tr>

                <tr *ngFor="let t of total" class="total">
                  <td class="text-left">{{ t.label }}</td>
                  <td>{{ t.fte }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- View More -->
          <div class="viewmore pointer mt-3" (click)="getDetailPage()">
            <span>View More&nbsp;&nbsp;</span><i class="fa fa-angle-right"></i>
          </div>
        </ng-container>
      </div>
    </div>
  </div>
</div>

<ng-template #infotemp>
  <lift-popover popoverTitle="Workforce Supply (FTE) by Country & Job" popoverText="">
    <span><i class="far fa-info-circle"></i></span>
  </lift-popover>
</ng-template>


.budget-card-box {
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);

  .widget-heading {
    font-size: 14px;
    font-weight: 600;
    color: #2d2d2d;
  }

  .ellipsis {
    cursor: pointer;
  }

  .TableView {
    .table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 8px;
        font-size: 13px;
      }

      .total {
        font-weight: bold;
        background: #f5f5f5;
      }
    }
  }

  .flag-icon {
    width: 18px;
    height: 12px;
    margin-right: 6px;
  }

  .viewmore {
    font-size: 13px;
    font-weight: 500;
    color: #00796b;
    text-align: right;
  }
}
