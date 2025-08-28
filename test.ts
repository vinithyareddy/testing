<div class="budget-card-box" #chartsection>
  <div class="budget-box-chart">
    <!-- Header -->
    <div class="row card-box-header-sec">
      <div class="widget-heading pointer mt-1 col-md-8">
        <span>
          Workforce Supply (FTE) by FCV Status
          <ng-template [ngTemplateOutlet]="infotemp"></ng-template>
        </span>
      </div>
      <div class="col-md-4 bgt-text-end">
        <div class="zoomicon">
          <span *ngIf="collapsed" (click)="expand()"
            ><img src="assets/images/icons/arrow_up.png"
          /></span>
          <span *ngIf="!collapsed" (click)="collapse()"
            ><img src="assets/images/icons/arrow_down.png"
          /></span>
        </div>
        <div class="togglebtn">
          <div
            class="lft-toggle"
            [class.lft-toggle-active]="widgetType == 'th'"
            (click)="loadWidget('th')"
          >
            <i class="fa fa-table fnticon"></i>
          </div>
          <div
            class="rgt-toggle"
            [class.rgt-toggle-active]="widgetType == 'ch'"
            (click)="loadWidget('ch')"
          >
            <i class="fa fa-bar-chart fnticon"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div [@collapse]="collapsed">
      <!-- Loader -->
      <ng-container *ngIf="!ResponseFlag">
        <div class="loader-img">
          <lift-section-loader></lift-section-loader>
        </div>
      </ng-container>

      <!-- Chart View -->
      <ng-container *ngIf="ResponseFlag">
        <ng-container *ngIf="widgetType == 'ch'">
          <div class="inner-card-box">
            <highcharts-chart
              [Highcharts]="Highcharts"
              [options]="chartOptions"
              [constructorType]="'chart'"
              style="width: 100%; height: 260px; display: block;"
            >
            </highcharts-chart>
          </div>
        </ng-container>

        <!-- Table View -->
        <ng-container *ngIf="widgetType == 'th'">
          <div class="row table-row">
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th class="tbl_left">FCV Status</th>
                    <th class="tl_left">Units</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of fcvData">
                    <td class="tbl_left">{{ item.name }}</td>
                    <td class="tl_right text-link-color">{{ item.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </ng-container>

        <!-- Footer -->
        <div class="viewmore pointer mt-3 pt-3" (click)="getDetailPage()">
          <span>View More&nbsp;&nbsp;</span><i class="fa fa-angle-right"></i>
        </div>
      </ng-container>
    </div>
  </div>
</div>

<ng-template #infotemp>
  <lift-popover
    popoverTitle="Workforce Supply (FTE) by FCV Status"
    popoverText=""
    [config]="config1"
  >
    <span><i class="far fa-info-circle"></i></span>
  </lift-popover>
</ng-template>
