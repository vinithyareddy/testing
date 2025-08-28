<div [ngClass]="{ 'full-view': fullview }">
  <div class="budget-card-box">
    <div class="budget-box-chart">

      <!-- Header -->
      <div class="row card-box-header-sec align-items-center">
        <!-- Title + info -->
        <div class="col-md-9 d-flex align-items-center heading-sec">
          <span class="title-text">
            Workforce Supply (FTE) by Country & Job
          </span>
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </div>

        <!-- Right icons -->
        <div class="col-md-3 d-flex justify-content-end align-items-center header-icons">
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
              <thead>
                <tr>
                  <th class="text-left">Location and Job</th>
                  <th class="fte-col">FTE</th>
                </tr>
              </thead>

              <tbody>
                <tr *ngFor="let row of groupdata">
                  <td class="pointer text-left" (click)="expandRow(row)">
                    <span class="cell-content">
                      <i *ngIf="!row.expanded" class="far fa-plus-circle"></i>
                      <i *ngIf="row.expanded" class="far fa-minus-circle"></i>
                      <img [src]="'https://flagcdn.com/16x12/' + row.flag + '.png'" class="flag-icon" />
                      {{ row.country }}
                    </span>
                  </td>
                  <td class="fte-col">{{ row.fte }}</td>
                </tr>
              </tbody>

              <!-- ✅ Total row inside tfoot -->
              <tfoot>
                <tr *ngFor="let t of total" class="total">
                  <td class="text-left">{{ t.label }}</td>
                  <td class="fte-col">{{ t.fte }}</td>
                </tr>
              </tfoot>
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
