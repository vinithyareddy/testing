<div class="budget-card-box" #cartboxchartsection>
  <div class="budget-box-chart">
    <!-- header -->
    <div class="row card-box-header-sec">
      <div class="widget-heading pointer mt-1 col-md-8">
        <span>
          {{ title }}
          <!-- small blue info icon (using your popover pattern) -->
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>

      <div class="col-md-4 bgt-text-end">
        <div class="zoomicon">
          <span class="bgt-collabse-state pl-2" *ngIf="collapsed" (click)="expand()">
            <img src="assets/images/icons/arrow_up.png" />
          </span>
          <span class="bgt-collabse-state pl-2" *ngIf="!collapsed" (click)="collapse()">
            <img src="assets/images/icons/arrow_down.png" />
          </span>
        </div>

        <div class="togglebtn">
          <div class="lft-toggle" [class.lft-toggle-active]="widgetType === 'th'" (click)="loadWidget('th')">
            <i class="fa fa-table fnticon" aria-hidden="true"></i>
          </div>
          <div class="rgt-toggle" [class.rgt-toggle-active]="widgetType === 'ch'" (click)="loadWidget('ch')">
            <i class="fa fa-bar-chart fnticon" aria-hidden="true"></i>
          </div>

          <!-- kebab menu for parity with source UI -->
          <div class="kebab">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- body -->
    <div [@collapse]="collapsed">
      <ng-container *ngIf="!ResponseFlag">
        <div class="loader-img">
          <div class="col-md-12"><div #cartboxchartsection></div></div>
          <lift-section-loader></lift-section-loader>
        </div>
      </ng-container>

      <ng-container *ngIf="ResponseFlag">
        <!-- CHART VIEW -->
        <ng-container *ngIf="widgetType === 'ch'">
          <div class="inner-card-box">
            <div class="row">
              <div class="col-md-11 col-lg-11" #cartboxchartsection>
                <div *ngFor="let trendchart of PieChart">
                  <highcharts-chart
                    [Highcharts]="trendchart.Highcharts"
                    [options]="trendchart.chartOptions"
                    [constructorType]="trendchart.chartConstructor">
                  </highcharts-chart>
                </div>
              </div>
              <div class="col-md-1 col-lg-1"></div>
            </div>

            <!-- legend styling matches screenshot -->
            <div class="legend">
              <span class="dot dot-fcv"></span> FCV
              <span class="dot dot-non"></span> Non - FCV
            </div>
          </div>
        </ng-container>

        <!-- TABLE VIEW -->
        <ng-container *ngIf="widgetType === 'th'">
          <div class="row table-row">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th class="tbl_left">Pending Approval</th>
                    <th class="tl_left">Units</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td class="tbl_left">Operations</td><td class="tl_right">10</td></tr>
                  <tr><td class="tbl_left">HR</td><td class="tl_right">19</td></tr>
                  <tr><td class="tbl_left">Finance</td><td class="tl_right">12</td></tr>
                  <tr><td class="tbl_left">Security</td><td class="tl_right">7</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </ng-container>

        <div class="viewmore pointer mt-3 pt-3" (click)="getDetailPage()">
          <span>View All&nbsp;&nbsp;</span><i class="fa fa-angle-right"></i>
        </div>
      </ng-container>
    </div>
  </div>
</div>

<!-- info popover template (blue & small) -->
<ng-template #infotemp>
  <lift-popover
    [config]="{placement: 'right', trigger: 'hover'}"
    popoverTitle="{{ title }}"
    popoverText="">
    <span class="info-icon" title="Info">
      <i class="far fa-info-circle"></i>
    </span>
  </lift-popover>
</ng-template>
